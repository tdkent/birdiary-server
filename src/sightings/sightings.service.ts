import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { LocationService } from '../locations/locations.service';
import { BirdService } from '../bird/bird.service';
import {
  CreateSightingDto,
  GetSightingsDto,
  UpdateSightingDto,
} from '../sightings/dto/sighting.dto';
import {
  ErrorMessages,
  type Sighting,
  type Group,
  type ListWithCount,
} from '../common/models';
import { TAKE_COUNT } from '../common/constants';
import {
  getCountOfSightingsByDate,
  getCountOfSightingsByLocation,
  getCountOfSightingsByDistinctBird,
  getSightingsGroupedByDate,
  getSightingsGroupedByLocation,
} from '../sightings/sql/sighting.sql';

@Injectable()
export class SightingsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly locationService: LocationService,
    private readonly birdService: BirdService,
  ) {}

  /** Create a new sighting */
  async createSighting(
    userId: number,
    reqBody: CreateSightingDto,
  ): Promise<Sighting> {
    const { birdId, date, description, location } = reqBody;
    let locationId: { id: number } | null = null;
    try {
      if (location) {
        const upsertLocation = await this.locationService.findOrCreate(
          userId,
          location,
        );
        locationId = { id: upsertLocation.id };
      }

      const sighting = await this.databaseService.sighting.create({
        data: {
          userId,
          birdId,
          date,
          description,
          locationId: locationId?.id || null,
        },
      });

      return sighting;
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
  ): Promise<ListWithCount<Sighting | Group>> {
    try {
      const { groupBy, birdId, locationId, dateId, page, sortBy } = reqQuery;
      if (!groupBy && !birdId && !locationId && !dateId) {
        const count = await this.databaseService.sighting.count({
          where: { userId },
        });
        const data = await this.databaseService.sighting.findMany({
          where: { userId },
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
      if (!page || !sortBy || Object.keys(reqQuery).length !== 3)
        throw new BadRequestException();
      if (groupBy) {
        if (groupBy === 'date') {
          const [count]: { count: number }[] =
            await this.databaseService.$queryRaw(
              getCountOfSightingsByDate(userId),
            );
          const data: Group[] = await this.databaseService.$queryRaw(
            getSightingsGroupedByDate(userId, sortBy, page),
          );
          return { countOfRecords: count.count, data };
        }
        if (groupBy === 'location') {
          const [count]: { count: number }[] =
            await this.databaseService.$queryRaw(
              getCountOfSightingsByLocation(userId),
            );
          const data: Group[] = await this.databaseService.$queryRaw(
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
          include: { bird: true, location: true },
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

  /** Get a sighting */
  async getSighting(userId: number, sightingId: number): Promise<Sighting> {
    const sighting = await this.databaseService.sighting
      .findFirstOrThrow({
        where: {
          AND: [{ userId }, { id: sightingId }],
        },
        include: { location: true },
      })
      .then(async (res) => {
        const birdWithImage = await this.birdService.getBird(res.birdId);
        return { ...res, bird: birdWithImage };
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

    return sighting;
  }

  // Check if request includes location to update
  // If so, check if location needs to be updated
  // If so, check if userId-name pairing already exists
  // If so, get the locationId and apply to request body
  // If location does not exist, create new and apply locationId
  // Use findOrCreate for both steps?
  // Do not delete old location if updating means it no longer
  // has any linked sightings, leave to user as a separate action

  /** Update a sighting. */
  async updateSighting(
    userId: number,
    sightingId: number,
    reqBody: UpdateSightingDto,
  ): Promise<{ count: number }> {
    const { location, ...requestData } = reqBody;
    const updateSightingData = requestData;
    let locationId: { id: number } | null = null;
    try {
      if (location) {
        locationId = await this.locationService.findOrCreate(userId, location);
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
  async deleteSighting(
    userId: number,
    sightingId: number,
  ): Promise<{ count: number }> {
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
