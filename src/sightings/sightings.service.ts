import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { LocationService } from 'src/locations/locations.service';
import {
  CreateSightingDto,
  GetSightingsDto,
  UpdateSightingDto,
} from 'src/sightings/dto/sighting.dto';
import { UpdateSighting } from '../common/models/update-sighting.model';
import ErrorMessages from '../common/errors/errors.enum';
import type { GroupedData } from 'src/types/api';
import { TAKE_COUNT } from 'src/common/constants/api.constants';
import {
  getCountOfSightingsByDate,
  getCountOfSightingsByLocation,
  getCountOfSightingsByDistinctBird,
  getSightingsGroupedByDate,
  getSightingsGroupedByLocation,
} from 'src/sightings/sql/sighting.sql';

@Injectable()
export class SightingsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly locationService: LocationService,
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
      console.error(err);
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }

  /**
   * Get a paginated list of user's sightings.
   * Use optional `groupBy` queries 'date', 'location', 'lifelist' to get grouped data.
   * Use optional `birdId`, `locationId`, `date` queries to get filtered data.
   * If none of these queries provided, return user's recent sightings.
   * `page` and `sortBy` queries are required.
   */
  async getSightings(
    userId: number,
    reqQuery: GetSightingsDto,
  ): Promise<{ countOfRecords: number; data: any[] }> {
    try {
      if (!Object.keys(reqQuery).length) {
        const data = await this.databaseService.sighting.findMany({
          where: { userId },
          orderBy: { date: 'desc' },
          take: TAKE_COUNT,
        });
        return { countOfRecords: data.length, data };
      }
      const { groupBy, birdId, locationId, dateId, page, sortBy } = reqQuery;
      if (!page || !sortBy || Object.keys(reqQuery).length !== 3)
        throw new BadRequestException();
      if (groupBy) {
        if (groupBy === 'date') {
          const [count]: { count: number }[] =
            await this.databaseService.$queryRaw(
              getCountOfSightingsByDate(userId),
            );
          const data: GroupedData[] = await this.databaseService.$queryRaw(
            getSightingsGroupedByDate(userId, sortBy, page),
          );
          return { countOfRecords: count.count, data };
        }
        if (groupBy === 'location') {
          const [count]: { count: number }[] =
            await this.databaseService.$queryRaw(
              getCountOfSightingsByLocation(userId),
            );
          const data: GroupedData[] = await this.databaseService.$queryRaw(
            getSightingsGroupedByLocation(userId, sortBy, page),
          );
          return { countOfRecords: count.count, data };
        }
        if (groupBy === 'lifelist') {
          const [count]: { count: number }[] =
            await this.databaseService.$queryRaw(
              getCountOfSightingsByDistinctBird(userId),
            );
          const data = await this.databaseService.sighting.findMany({
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
          return { countOfRecords: count.count, data };
        }
      }
      if (birdId) {
        const count = await this.databaseService.sighting.count({
          where: { userId, birdId },
        });
        const data = await this.databaseService.sighting.findMany({
          where: { userId, birdId },
          include: { location: true },
          orderBy: sortBy === 'dateAsc' ? { date: 'asc' } : { date: 'desc' },
          take: TAKE_COUNT,
          skip: TAKE_COUNT * (page - 1),
        });
        return { countOfRecords: count, data };
      }
      if (locationId) {
        const count = await this.databaseService.sighting.count({
          where: { userId, locationId },
        });
        const data = await this.databaseService.sighting.findMany({
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
        });
        return { countOfRecords: count, data };
      }
      if (dateId) {
        const count = await this.databaseService.sighting.count({
          where: { userId, date: new Date(dateId) },
        });
        const data = await this.databaseService.sighting.findMany({
          where: {
            userId: userId,
            date: new Date(dateId),
          },
          include: { bird: true, location: true },
          orderBy:
            sortBy === 'alphaAsc'
              ? { bird: { commonName: 'asc' } }
              : { bird: { commonName: 'desc' } },
          take: TAKE_COUNT,
          skip: TAKE_COUNT * (page - 1),
        });
        return { countOfRecords: count, data };
      } else throw new BadRequestException();
    } catch (err) {
      console.error(err);
      if (err instanceof BadRequestException) {
        throw new BadRequestException(ErrorMessages.BadRequest);
      }
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
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
        console.error(err);
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
        console.error(err);
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
    reqBody: UpdateSightingDto,
  ) {
    const { location, ...requestData } = reqBody;
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
      console.error(err);
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
        console.error(err);
        if (err instanceof NotFoundException) {
          throw new NotFoundException(ErrorMessages.ResourceNotFound);
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }
}
