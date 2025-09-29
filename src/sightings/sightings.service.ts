import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BirdService } from '../bird/bird.service';
import {
  DETAILS_RESULTS_PER_PAGE,
  RESULTS_PER_PAGE,
} from '../common/constants';
import {
  Bird,
  ErrorMessages,
  type Group,
  type ListWithCount,
  type Sighting,
} from '../common/models';
import { DatabaseService } from '../database/database.service';
import { LocationService } from '../locations/locations.service';
import {
  CreateSightingDto,
  GetSightingsDto,
  UpdateSightingDto,
} from '../sightings/dto/sighting.dto';
import {
  getCountOfSightingsByDate,
  getCountOfSightingsByDistinctBird,
  getSightingsGroupedByDate,
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
      const { groupBy, birdId, dateId, page, sortBy } = reqQuery;
      // If no request queries, get all user's sightings
      if (!groupBy && !birdId && !dateId) {
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
          take: RESULTS_PER_PAGE,
          skip: RESULTS_PER_PAGE * (page - 1),
        });
        return { countOfRecords: count, data };
      }
      // Throw error if request queries are misconfigured
      if (!page || !sortBy || Object.keys(reqQuery).length !== 3)
        throw new BadRequestException();
      if (groupBy) {
        // Group sightings by date
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
        // Get user's life list
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
            take: RESULTS_PER_PAGE,
            skip: RESULTS_PER_PAGE * (page - 1),
          });
          return { countOfRecords: count.count, data };
        }
      }
      // Get sightings by bird
      if (birdId) {
        const count = await this.databaseService.sighting.count({
          where: { userId, birdId },
        });
        const data = await this.databaseService.sighting.findMany({
          where: { userId, birdId },
          include: { bird: true, location: true },
          orderBy: sortBy === 'dateAsc' ? { date: 'asc' } : { date: 'desc' },
          take: DETAILS_RESULTS_PER_PAGE,
          skip: DETAILS_RESULTS_PER_PAGE * (page - 1),
        });
        return { countOfRecords: count, data };
      }
      // Get sightings by date
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
          take: DETAILS_RESULTS_PER_PAGE,
          skip: DETAILS_RESULTS_PER_PAGE * (page - 1),
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
  async getSighting(
    userId: number,
    sightingId: number,
  ): Promise<Sighting & { bird: Bird }> {
    try {
      const sighting = await this.databaseService.sighting.findUniqueOrThrow({
        where: { id: sightingId },
        include: { location: true },
      });
      if (sighting.userId !== userId) throw new ForbiddenException();
      const birdWithImage = await this.birdService.getBird(sighting.birdId);
      return { ...sighting, bird: birdWithImage };
    } catch (err) {
      console.error(err);
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(ErrorMessages.AccessForbidden);
      }
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException(ErrorMessages.ResourceNotFound);
        }
      }
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }

  /** Update a sighting. */
  async updateSighting(
    userId: number,
    sightingId: number,
    reqBody: UpdateSightingDto,
  ): Promise<Sighting> {
    const { location, ...requestData } = reqBody;
    const updateSightingData = requestData;
    let locationId: { id: number } | null = null;
    try {
      const sighting = await this.databaseService.sighting.findUniqueOrThrow({
        where: { id: sightingId },
      });
      if (sighting.userId !== userId) throw new ForbiddenException();
      if (location) {
        locationId = await this.locationService.findOrCreate(userId, location);
        updateSightingData['locationId'] = locationId.id;
      } else {
        updateSightingData['locationId'] = null;
      }
      return this.databaseService.sighting.update({
        data: {
          ...updateSightingData,
        },
        where: { id: sightingId },
      });
    } catch (err) {
      console.error(err);
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(ErrorMessages.AccessForbidden);
      }
      if (err instanceof NotFoundException) {
        throw new NotFoundException(ErrorMessages.ResourceNotFound);
      }
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }

  /** Delete a sighting. */
  async deleteSighting(userId: number, sightingId: number): Promise<Sighting> {
    try {
      const sighting = await this.databaseService.sighting.findUniqueOrThrow({
        where: { id: sightingId },
      });
      if (sighting.userId !== userId) throw new ForbiddenException();
      return this.databaseService.sighting.delete({
        where: { id: sightingId },
      });
    } catch (err) {
      console.error(err);
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(ErrorMessages.AccessForbidden);
      }
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException(ErrorMessages.ResourceNotFound);
        }
      }
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }
}
