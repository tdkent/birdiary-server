import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { LocationService } from 'src/locations/locations.service';
import { BirdService } from '../bird/bird.service';
import {
  CreateSightingDto,
  GetSightingsDto,
} from 'src/sightings/dto/sighting.dto';
import { UpdateSightingDto } from './dto/update-sighting.dto';
// import { GroupSightingDto } from './dto/group-sighting.dto';
// import { GetRecentSightingsDto } from './dto/get-recent-sightings.dto';
import { UpdateSighting } from '../common/models/update-sighting.model';
import ErrorMessages from '../common/errors/errors.enum';
import type { ListResponse, GroupedData } from 'src/types/api';
import { TAKE_COUNT } from 'src/common/constants/api.constants';
import { GetSightingByDateQueryDto } from 'src/sightings/dto/get-sighting-by-date-query.dto';
import { GetSightingByBirdQueryDto } from 'src/sightings/dto/get-sightings-by-bird-query.dto';
import { GetSightingByLocationQueryDto } from 'src/sightings/dto/get-sightings-by-location-query.dto';

@Injectable()
export class SightingsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly locationService: LocationService,
    private readonly birdService: BirdService,
  ) {}

  /** Create a new sighting */
  async createSighting(userId: number, reqBody: CreateSightingDto) {
    const { birdId, date, description, location } = reqBody;
    let locationId: { id: number } | null = null;
    try {
      if (location) {
        locationId = await this.locationService.createLocation(location);
      }

      await this.databaseService.sighting.create({
        data: {
          userId,
          birdId,
          date,
          description,
          locationId: locationId?.id || null,
        },
      });

      return { message: 'ok' };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }

  /**
   * Get a paginated list of user's sightings.
   * Use queries to group data by date, bird, location, or life list.
   * If no queries provided, returns most recent sightings.
   */
  async getSightings(userId: number, reqQuery: GetSightingsDto) {
    const { groupBy } = reqQuery;
    try {
      switch (groupBy) {
        case 'date': {
          const { page, sortBy } = reqQuery;
          const allDiaryEntries: { date: Date }[] = await this.databaseService
            .$queryRaw`
                SELECT date 
                FROM "Sighting"
                WHERE "userId" = ${userId}
                GROUP BY date
                `;

          let inputString = Prisma.raw(`date DESC`);
          if (sortBy === 'count')
            inputString = Prisma.raw(`count DESC, date DESC`);
          if (sortBy === 'dateAsc') inputString = Prisma.raw(`date ASC`);

          const query = Prisma.sql`
                SELECT
                  CAST(
                    REPLACE(
                    LEFT(CAST(date AS text), 10), '-', ''
                  ) AS int) AS id,
                  date AS text,
                  CAST(count(*) AS int) AS count
                FROM "Sighting"
                WHERE "userId" = ${userId}
                GROUP BY date
                ORDER BY ${inputString}
                LIMIT ${TAKE_COUNT}
                OFFSET ${TAKE_COUNT * (page - 1)}
                `;
          const data: GroupedData[] =
            await this.databaseService.$queryRaw(query);
          const list = {
            message: 'ok',
            data: {
              countOfRecords: allDiaryEntries.length,
              items: data,
            },
          };
          return list;
        }
        case 'location': {
          const { page, sortBy } = reqQuery;

          const distinctLocations =
            await this.databaseService.sighting.findMany({
              distinct: ['locationId'],
              where: {
                AND: [{ userId }, { locationId: { not: null } }],
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
                WHERE s."userId" = ${userId}
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
                WHERE s."userId" = ${userId}
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
                WHERE s."userId" = ${userId}
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
            by: ['birdId'],
            where: { userId },
            _count: { _all: true },
          });
          return birdGroup;
        }

        case 'lifelist': {
          const { page, sortBy } = reqQuery;
          if (!page) throw new BadRequestException();

          //? Replace with count?
          const getSightings = await this.databaseService.sighting.findMany({
            where: { userId },
            distinct: ['birdId'],
          });

          const countOfRecords = getSightings.length;

          const sightings = await this.databaseService.sighting.findMany({
            where: { userId },
            distinct: ['birdId'],
            include: { bird: true },
            orderBy:
              sortBy === 'alphaDesc'
                ? [{ bird: { commonName: 'desc' } }]
                : sortBy === 'dateAsc'
                  ? [{ date: 'asc' }, { bird: { commonName: 'asc' } }]
                  : sortBy === 'dateDesc'
                    ? [{ date: 'desc' }, { bird: { commonName: 'asc' } }]
                    : [{ bird: { commonName: 'asc' } }],
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
            where: { userId },
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
  // async findRecent(userId: number) {
  //   const data = await this.databaseService.sighting
  //     .findMany({
  //       where: { userId },
  //       orderBy: { date: 'desc' },
  //       take: TAKE_COUNT,
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       throw new InternalServerErrorException(ErrorMessages.DefaultServer);
  //     });

  //   return { message: 'ok', data };
  // }

  //---- FIND USER'S SIGHTINGS BY SINGLE DATE
  async findSightingsBySingleDate(
    userId: number,
    date: Date,
    query: GetSightingByDateQueryDto,
  ) {
    const { page, sortBy } = query;
    const count = await this.databaseService.sighting.count({
      where: { userId, date: new Date(date) },
    });
    const data = await this.databaseService.sighting
      .findMany({
        where: {
          userId: userId,
          date: new Date(date),
        },
        include: { bird: true, location: true },
        orderBy:
          sortBy === 'alphaAsc'
            ? { bird: { commonName: 'asc' } }
            : { bird: { commonName: 'desc' } },
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
        countOfRecords: count,
        items: data,
      },
    };
    return list;
  }

  //---- FIND USER'S SIGHTINGS BY SINGLE BIRD
  async findSightingsBySingleBird(
    userId: number,
    birdId: number,
    query: GetSightingByBirdQueryDto,
  ) {
    const { page, sortBy } = query;
    const count = await this.databaseService.sighting.count({
      where: { userId, birdId },
    });
    const data = await this.databaseService.sighting
      .findMany({
        where: { userId, birdId },
        include: { location: true },
        orderBy: sortBy === 'dateAsc' ? { date: 'asc' } : { date: 'desc' },
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
        countOfRecords: count,
        items: data,
      },
    };
    return list;
  }

  //---- FIND USER'S SIGHTINGS BY SINGLE LOCATION
  async findSightingsBySingleLocation(
    userId: number,
    locationId: number,
    query: GetSightingByLocationQueryDto,
  ) {
    const { page, sortBy } = query;
    const count = await this.databaseService.sighting.count({
      where: { userId, locationId },
    });
    const sightings = await this.databaseService.sighting
      .findMany({
        where: { userId, locationId },
        include: { bird: true },
        orderBy:
          sortBy === 'alphaDesc'
            ? [{ bird: { commonName: 'desc' } }]
            : sortBy === 'dateAsc'
              ? [{ date: 'asc' }, { bird: { commonName: 'asc' } }]
              : sortBy === 'dateDesc'
                ? [{ date: 'desc' }, { bird: { commonName: 'asc' } }]
                : [{ bird: { commonName: 'asc' } }],
        take: TAKE_COUNT,
        skip: TAKE_COUNT * (page - 1),
      })
      .catch((err) => {
        console.log(err);
        if (err instanceof NotFoundException) {
          throw new NotFoundException(ErrorMessages.ResourceNotFound);
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });

    const list: ListResponse = {
      message: 'ok',
      data: {
        countOfRecords: count,
        items: sightings,
      },
    };
    return list;
  }

  //---- GROUP USER'S SIGHTINGS BY SINGLE LOCATION
  //? Prisma does not support include or select with groupBy()
  async groupBirdsByLocation(userId: number, locationId: number) {
    return this.databaseService.sighting
      .groupBy({
        by: ['birdId'],
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

  //---- FIND A SINGLE SIGHTING
  //? Currently this method is only used in testing
  async findOne(userId: number, sightingId: number) {
    return this.databaseService.sighting
      .findFirstOrThrow({
        where: {
          AND: [{ userId }, { id: sightingId }],
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

  /** Update a sighting. */
  async updateSighting(
    userId: number,
    sightingId: number,
    updateSightingDto: UpdateSightingDto,
  ) {
    const { location, ...requestData } = updateSightingDto;
    const updateSightingData: UpdateSighting = requestData;
    let locationId: { id: number } | null = null;
    try {
      if (location) {
        locationId = await this.locationService.createLocation(location);
        updateSightingData['locationId'] = locationId.id;
      }

      // updateMany is required when using multiple `where` clauses
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

  /** Delete a sighting. */
  async deleteSighting(userId: number, sightingId: number) {
    // deleteMany is required when using multiple `where` clauses
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
