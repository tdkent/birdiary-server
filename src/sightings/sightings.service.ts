import {
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

@Injectable()
export class SightingsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly locationService: LocationService,
    private readonly birdService: BirdService,
  ) {}
  //---- CREATE NEW SIGHTING
  async create(id: string, createSightingDto: CreateSightingDto) {
    const { bird_id, date, desc, location } = createSightingDto;
    let locationId: { id: number } | null = null;
    try {
      if (location) {
        locationId = await this.locationService.upsert(location);
      }

      await this.databaseService.sighting.create({
        data: {
          user_id: id,
          bird_id,
          date,
          desc,
          location_id: locationId?.id || null,
        },
      });

      return { message: 'ok' };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }

  //---- GET USER'S SIGHTINGS
  async findAllOrGroup(id: string, query: GroupSightingDto) {
    try {
      if (query.groupby) {
        if (query.groupby === 'date') {
          return this.databaseService.sighting.groupBy({
            by: ['date'],
            where: { user_id: id },
            _count: { _all: true },
          });
        } else if (query.groupby === 'location') {
          const locGroup = await this.databaseService.sighting.groupBy({
            by: ['location_id'],
            where: { user_id: id },
            _count: { _all: true },
          });
          for (const loc of locGroup) {
            const location = await this.locationService.findOne(
              loc.location_id,
            );
            loc['location_name'] = location.name;
          }
          return locGroup;
        } else {
          const birdGroup = await this.databaseService.sighting.groupBy({
            by: ['bird_id'],
            where: { user_id: id },
            _count: { _all: true },
          });
          for (const b of birdGroup) {
            const bird = await this.birdService.findOne(b.bird_id);
            b['bird_name'] = bird.comm_name;
          }
          return birdGroup;
        }
      }
      return this.databaseService.sighting.findMany({
        where: { user_id: id },
        select: {
          id: true,
          date: true,
          bird: {
            select: {
              id: true,
              comm_name: true,
            },
          },
          location: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }

  //---- FIND USER'S RECENT SIGHTINGS
  async findRecent(id: string) {
    return await this.databaseService.sighting
      .findMany({
        where: { user_id: id },
        include: { bird: { select: { comm_name: true } } },
        orderBy: { date: 'desc' },
        take: 10,
      })
      .then((res) => {
        const data = res.map(({ bird, ...res }) => {
          return {
            ...res,
            commName: bird.comm_name,
          };
        });
        return { message: 'ok', data };
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  //---- FIND USER'S LIFE LIST
  async findLifeList(id: string) {
    return this.databaseService.sighting
      .findMany({
        where: { user_id: id },
        distinct: ['bird_id'],
        select: {
          id: true,
          date: true,
          bird: {
            select: {
              id: true,
              comm_name: true,
            },
          },
          location: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          date: 'asc',
        },
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  //---- FIND USER'S SIGHTINGS BY SINGLE DATE
  async findSightingsBySingleDate(userId: string, date: Date) {
    return this.databaseService.sighting
      .findMany({
        where: {
          user_id: userId,
          date: new Date(date),
        },
        select: {
          id: true,
          desc: true,
          bird: {
            select: {
              id: true,
              comm_name: true,
            },
          },
          location: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  //---- FIND USER'S SIGHTINGS BY SINGLE BIRD
  async findSightingsBySingleBird(userId: string, birdId: number) {
    return this.databaseService.sighting
      .findMany({
        where: {
          user_id: userId,
          bird_id: birdId,
        },
        select: {
          id: true,
          date: true,
          desc: true,
          location: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  //---- FIND USER'S SIGHTINGS BY SINGLE LOCATION
  async findSightingsBySingleLocation(userId: string, locationId: number) {
    return this.databaseService.sighting
      .findMany({
        where: {
          user_id: userId,
          location_id: locationId,
        },
        select: {
          id: true,
          date: true,
          desc: true,
          bird: {
            select: {
              id: true,
              comm_name: true,
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
        by: ['bird_id'],
        where: {
          user_id: userId,
          location_id: locationId,
        },
        _count: { _all: true },
      })
      .then(async (res) => {
        if (!res.length) {
          throw new NotFoundException();
        }
        for (const el of res) {
          const bird = await this.birdService.findOne(el.bird_id);
          el['comm_name'] = bird.comm_name;
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
    return;
  }

  //---- FIND A SINGLE SIGHTING
  //? Currently this method is only used in testing
  async findOne(userId: string, sightingId: number) {
    return this.databaseService.sighting
      .findFirstOrThrow({
        where: {
          AND: [{ user_id: userId }, { id: sightingId }],
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
        updateSightingData['location_id'] = locationId.id;
      }
      const res = await this.databaseService.sighting.updateMany({
        data: {
          ...updateSightingData,
        },
        where: { id: sightingId, user_id: userId },
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
        where: { id: sightingId, user_id: userId },
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
