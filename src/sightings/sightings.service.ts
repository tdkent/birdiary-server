import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { LocationService } from './location.service';
import { BirdService } from '../bird/bird.service';
import { CreateSightingDto } from './dto/create-sighting.dto';
import { UpdateSightingDto } from './dto/update-sighting.dto';
import { GroupSightingDto } from './dto/group-sighting.dto';
// import { GetRecentSightingsDto } from './dto/get-recent-sightings.dto';
import { UpdateSighting } from '../common/models/update-sighting.model';
import ErrorMessages from '../common/errors/errors.enum';
import type { ListResponse, GroupedData } from 'src/types/api';
import { TAKE_COUNT } from 'src/common/constants/api.constants';
import { GetSightingByDateQueryDto } from 'src/sightings/dto/get-sighting-by-date-query.dto';

@Injectable()
export class SightingsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly locationService: LocationService,
    private readonly birdService: BirdService,
  ) {}
  //---- CREATE NEW SIGHTING
  async create(id: string, createSightingDto: CreateSightingDto) {
    const { commName, date, desc, location } = createSightingDto;
    let locationId: { id: number } | null = null;
    try {
      if (location) {
        locationId = await this.locationService.upsert(location);
      }

      await this.databaseService.sighting.create({
        data: {
          userId: id,
          commName,
          date,
          desc,
          locationId: locationId?.id || null,
        },
      });

      return { message: 'ok' };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }

  //---- GET USER'S SIGHTINGS
  // Group by date, location, bird, lifelist, or send all
  // Note: Invalid query keys are ignored and the default case is used
  async findAllOrGroup(id: string, query: GroupSightingDto) {
    const { groupBy } = query;
    try {
      switch (groupBy) {
        case 'date': {
          const { page, sortBy } = query;

          const allDiaryEntries: { date: Date }[] = await this.databaseService
            .$queryRaw`
                SELECT date 
                FROM "Sighting"
                WHERE "userId" = CAST(${id} AS uuid)
                GROUP BY date
                `;

          let data: GroupedData[] = [];

          switch (sortBy) {
            case 'count': {
              data = await this.databaseService.$queryRaw`
                SELECT
                  CAST(
                    REPLACE(
                    LEFT(CAST(date AS text), 10), '-', ''
                  ) AS int) AS id,
                  date AS text, 
                  CAST(count(*) AS int) AS count
                FROM "Sighting"
                WHERE "userId" = CAST(${id} AS uuid)
                GROUP BY date
                ORDER BY count DESC, date DESC
                LIMIT ${TAKE_COUNT}
                OFFSET ${TAKE_COUNT * (page - 1)}
                `;
              break;
            }
            case 'dateAsc': {
              data = await this.databaseService.$queryRaw`
                SELECT
                  CAST(
                    REPLACE(
                    LEFT(CAST(date AS text), 10), '-', ''
                  ) AS int) AS id,
                  date AS text, 
                  CAST(count(*) AS int) AS count
                FROM "Sighting"
                WHERE "userId" = CAST(${id} AS uuid)
                GROUP BY date
                ORDER BY date ASC
                LIMIT ${TAKE_COUNT}
                OFFSET ${TAKE_COUNT * (page - 1)}
                `;
              break;
            }
            default: {
              data = await this.databaseService.$queryRaw`
                SELECT
                  CAST(
                    REPLACE(
                    LEFT(CAST(date AS text), 10), '-', ''
                  ) AS int) AS id,
                  date AS text, 
                  CAST(count(*) AS int) AS count
                FROM "Sighting"
                WHERE "userId" = CAST(${id} AS uuid)
                GROUP BY date
                ORDER BY date DESC
                LIMIT ${TAKE_COUNT}
                OFFSET ${TAKE_COUNT * (page - 1)}
                `;
            }
          }

          const list: ListResponse = {
            message: 'ok',
            data: {
              countOfRecords: allDiaryEntries.length,
              items: data,
            },
          };
          return list;
        }

        // Note: Prisma cannot combine groupBy and select/include
        // This makes sorting on location name impossible w/o multiple
        // queries and JS array methods.
        // count(*) is cast to int to prevent BigInt error
        case 'location': {
          const { page, sortBy } = query;

          const distinctLocations =
            await this.databaseService.sighting.findMany({
              distinct: ['locationId'],
              where: {
                AND: [{ userId: id }, { locationId: { not: null } }],
              },
            });

          let locations = [];

          switch (sortBy) {
            case 'alphaDesc': {
              locations = await this.databaseService.$queryRaw`
                SELECT
                  s."locationId" AS id,
                  l.name AS text,
                  CAST(count(*) AS int) AS count
                FROM "Sighting" AS s
                JOIN "Location" AS l ON s."locationId" = l.id
                WHERE s."userId" = CAST(${id} AS uuid)
                AND s."locationId" IS NOT NULL
                GROUP BY s."locationId", l.name
                ORDER BY l.name DESC
                LIMIT ${TAKE_COUNT}
                OFFSET ${TAKE_COUNT * (page - 1)}
                `;
              break;
            }
            case 'count': {
              locations = await this.databaseService.$queryRaw`
                SELECT
                  s."locationId" AS id,
                  l.name AS text,
                  CAST(count(*) AS int) AS count
                FROM "Sighting" AS s
                JOIN "Location" AS l ON s."locationId" = l.id
                WHERE s."userId" = CAST(${id} AS uuid)
                AND s."locationId" IS NOT NULL
                GROUP BY s."locationId", l.name
                ORDER BY count DESC
                LIMIT ${TAKE_COUNT}
                OFFSET ${TAKE_COUNT * (page - 1)}
                `;
              break;
            }
            default: {
              locations = await this.databaseService.$queryRaw`
                SELECT
                  s."locationId" AS id,
                  l.name AS text,
                  CAST(count(*) AS int) AS count
                FROM "Sighting" AS s
                JOIN "Location" AS l ON s."locationId" = l.id
                WHERE s."userId" = CAST(${id} AS uuid)
                AND s."locationId" IS NOT NULL
                GROUP BY s."locationId", l.name
                ORDER BY l.name ASC
                LIMIT ${TAKE_COUNT}
                OFFSET ${TAKE_COUNT * (page - 1)}
                `;
            }
          }

          const list: ListResponse = {
            message: 'ok',
            data: {
              countOfRecords: distinctLocations.length,
              items: locations,
            },
          };

          return list;
        }

        case 'bird': {
          const birdGroup = await this.databaseService.sighting.groupBy({
            by: ['commName'],
            where: { userId: id },
            _count: { _all: true },
          });
          return birdGroup;
        }

        case 'lifelist': {
          const { page, sortBy } = query;
          if (!page) throw new BadRequestException();

          const getSightings = await this.databaseService.sighting.findMany({
            where: { userId: id },
            distinct: ['commName'],
          });

          const countOfRecords = getSightings.length;

          const sightings = await this.databaseService.sighting.findMany({
            where: { userId: id },
            distinct: ['commName'],
            orderBy:
              sortBy === 'alphaDesc'
                ? [{ commName: 'desc' }]
                : sortBy === 'dateAsc'
                  ? [{ date: 'asc' }, { commName: 'asc' }]
                  : sortBy === 'dateDesc'
                    ? [{ date: 'desc' }, { commName: 'asc' }]
                    : [{ commName: 'asc' }],
            take: TAKE_COUNT,
            skip: TAKE_COUNT * (page - 1),
          });

          const list: ListResponse = {
            message: 'ok',
            data: { countOfRecords, items: sightings },
          };

          return list;
        }

        default: {
          const sightings = await this.databaseService.sighting.findMany({
            where: { userId: id },
            orderBy: { date: 'desc' },
            take: TAKE_COUNT,
          });
          const list: ListResponse = {
            message: 'ok',
            data: { countOfRecords: sightings.length, items: sightings },
          };
          return list;
        }
      }
    } catch (err) {
      console.log(err);
      if (err instanceof BadRequestException) {
        throw new BadRequestException(ErrorMessages.BadRequest);
      }
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }

  //---- FIND USER'S RECENT SIGHTINGS
  async findRecent(id: string) {
    const data = await this.databaseService.sighting
      .findMany({
        where: { userId: id },
        orderBy: { date: 'desc' },
        take: TAKE_COUNT,
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });

    return { message: 'ok', data };
  }

  //---- FIND USER'S SIGHTINGS BY SINGLE DATE
  async findSightingsBySingleDate(
    userId: string,
    date: Date,
    query: GetSightingByDateQueryDto,
  ) {
    const { page, sortBy } = query;
    const count = await this.databaseService.sighting.findMany({
      where: {
        userId: userId,
        date: new Date(date),
      },
    });
    const data = await this.databaseService.sighting
      .findMany({
        where: {
          userId: userId,
          date: new Date(date),
        },
        include: { location: true },
        orderBy:
          sortBy === 'alphaAsc' ? { commName: 'asc' } : { commName: 'desc' },
        take: TAKE_COUNT,
        skip: TAKE_COUNT * (page - 1),
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });

    const list: ListResponse = {
      message: 'ok',
      data: {
        countOfRecords: count.length,
        items: data,
      },
    };
    return list;
  }

  //---- FIND USER'S SIGHTINGS BY SINGLE BIRD
  async findSightingsBySingleBird(userId: string, commName: string) {
    const data = await this.databaseService.sighting
      .findMany({
        where: {
          userId,
          commName,
        },
        include: { location: true },
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });

    const list: ListResponse = {
      message: 'ok',
      data: {
        countOfRecords: data.length,
        items: data,
      },
    };
    return list;
  }

  //---- FIND USER'S SIGHTINGS BY SINGLE LOCATION
  async findSightingsBySingleLocation(userId: string, locationId: number) {
    return this.databaseService.sighting
      .findMany({
        where: {
          userId: userId,
          locationId: locationId,
        },
        select: {
          id: true,
          date: true,
          desc: true,
          bird: {
            select: {
              id: true,
              commName: true,
            },
          },
        },
      })
      .then((res) => {
        if (!res.length) {
          throw new NotFoundException();
        }
        return res;
      })
      .catch((err) => {
        console.log(err);
        if (err instanceof NotFoundException) {
          throw new NotFoundException(ErrorMessages.ResourceNotFound);
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  //---- GROUP USER'S SIGHTINGS BY SINGLE LOCATION
  //? Prisma does not support include or select with groupBy()
  async groupBirdsByLocation(userId: string, locationId: number) {
    return this.databaseService.sighting
      .groupBy({
        by: ['commName'],
        where: {
          userId: userId,
          locationId: locationId,
        },
        _count: { _all: true },
      })
      .then(async (res) => {
        if (!res.length) {
          throw new NotFoundException();
        }
        // for (const el of res) {
        //   const bird = await this.birdService.findOne(el.commName);
        //   el['commName'] = bird.commName;
        // }
        return res;
      })
      .catch((err) => {
        console.log(err);
        if (err instanceof NotFoundException) {
          throw new NotFoundException(ErrorMessages.ResourceNotFound);
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
    return;
  }

  //---- FIND A SINGLE SIGHTING
  //? Currently this method is only used in testing
  async findOne(userId: string, sightingId: number) {
    return this.databaseService.sighting
      .findFirstOrThrow({
        where: {
          AND: [{ userId: userId }, { id: sightingId }],
        },
      })
      .catch((err) => {
        console.log(err);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            throw new NotFoundException(ErrorMessages.ResourceNotFound);
          }
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  //---- UPDATE A SIGHTING
  // result is an object with updated count :: { count: 0 } or { count: 1 }
  //? using updateMany in order to have multiple WHERE clauses
  async update(
    userId: string,
    sightingId: number,
    updateSightingDto: UpdateSightingDto,
  ) {
    const { location, ...requestData } = updateSightingDto;
    const updateSightingData: UpdateSighting = requestData;
    let locationId: { id: number } | null = null;
    try {
      if (location) {
        locationId = await this.locationService.upsert(location);
        updateSightingData['locationId'] = locationId.id;
      }
      const res = await this.databaseService.sighting.updateMany({
        data: {
          ...updateSightingData,
        },
        where: { id: sightingId, userId: userId },
      });
      if (!res.count) {
        throw new NotFoundException();
      }
      return res;
    } catch (err) {
      console.log(err);
      if (err instanceof NotFoundException) {
        throw new NotFoundException(ErrorMessages.ResourceNotFound);
      }
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }

  //---- DELETE A SIGHTING
  // result is an object with updated count :: { count: 0 } or { count: 1 }
  //? using deleteMany in order to have multiple WHERE clauses
  async remove(userId: string, sightingId: number) {
    return this.databaseService.sighting
      .deleteMany({
        where: { id: sightingId, userId: userId },
      })
      .then((res) => {
        if (!res.count) {
          throw new NotFoundException();
        }
        return res;
      })
      .catch((err) => {
        console.log(err);
        if (err instanceof NotFoundException) {
          throw new NotFoundException(ErrorMessages.ResourceNotFound);
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }
}
