import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Sighting } from '@prisma/client';
import { DETAILS_RESULTS_PER_PAGE } from '../common/constants';
import {
  ErrorMessages,
  type ListWithCount,
  type Location,
  type Locations,
} from '../common/models';
import { DatabaseService } from '../database/database.service';
import {
  CreateLocationDto,
  GetLocationsDto,
  GetSightingsByLocationDto,
} from '../locations/dto/location.dto';
import { getLocationsWithSightings } from './sql/locations.sql';

@Injectable()
export class LocationService {
  constructor(private readonly databaseService: DatabaseService) {}

  /** Find or create (upsert) a location. */
  async findOrCreate(
    userId: number,
    location: CreateLocationDto,
  ): Promise<Location> {
    return this.databaseService.location
      .upsert({
        where: { userId_name: { userId, name: location.name } },
        update: {},
        create: { userId, ...location },
      })
      .catch((err) => {
        console.error(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  /** Get location. */
  async getLocation(userId: number, locationId: number): Promise<Location> {
    try {
      const location = await this.databaseService.location.findUniqueOrThrow({
        where: { id: locationId },
      });
      if (location.userId !== userId) throw new ForbiddenException();
      return location;
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

  async getLocations(
    userId: number,
    reqQuery: GetLocationsDto,
  ): Promise<ListWithCount<Locations>> {
    const { page, sortBy } = reqQuery;
    try {
      const count = await this.databaseService.location.count({
        where: { userId },
      });
      const locations = await this.getLocationsWithSightings(
        userId,
        sortBy,
        page,
      );
      return { countOfRecords: count, data: locations };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }

  /** Get sightings by location. */
  async getSightingsByLocation(
    userId: number,
    locationId: number,
    reqQuery: GetSightingsByLocationDto,
  ): Promise<ListWithCount<Sighting>> {
    const { page, sortBy } = reqQuery;
    try {
      const location = await this.databaseService.location.findUniqueOrThrow({
        where: { id: locationId },
      });
      if (location.userId !== userId) throw new ForbiddenException();
      const count = await this.databaseService.sighting.count({
        where: { locationId },
      });
      const data = await this.databaseService.sighting.findMany({
        where: { locationId },
        include: { bird: true },
        orderBy:
          sortBy === 'alphaDesc'
            ? [{ bird: { commonName: 'desc' } }]
            : sortBy === 'dateAsc'
              ? [{ date: 'asc' }, { bird: { commonName: 'asc' } }]
              : sortBy === 'dateDesc'
                ? [{ date: 'desc' }, { bird: { commonName: 'asc' } }]
                : [{ bird: { commonName: 'asc' } }],
        take: DETAILS_RESULTS_PER_PAGE,
        skip: DETAILS_RESULTS_PER_PAGE * (page - 1),
      });
      return { countOfRecords: count, data };
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

  /** Upsert location and update user's related sightings. */
  async updateLocation(
    userId: number,
    locationId: number,
    reqBody: CreateLocationDto,
  ): Promise<Location> {
    try {
      const location = await this.databaseService.location.findUniqueOrThrow({
        where: { id: locationId },
      });
      if (location.userId !== userId) throw new ForbiddenException();
      const locationWithNameExists =
        await this.databaseService.location.findUnique({
          where: { userId_name: { userId, name: reqBody.name } },
        });
      if (!locationWithNameExists) {
        return this.databaseService.location.update({
          where: { id: locationId },
          data: { ...reqBody },
        });
      }
      await this.databaseService.sighting.updateMany({
        where: { locationId, userId },
        data: { locationId: locationWithNameExists.id },
      });
      return locationWithNameExists;
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

  /** Delete a single location. */
  async deleteLocation(userId: number, locationId: number): Promise<Location> {
    try {
      const location = await this.databaseService.location.findUniqueOrThrow({
        where: { id: locationId },
      });
      if (location.userId !== userId) throw new ForbiddenException();
      return this.databaseService.location.delete({
        where: { id: locationId },
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

  /** HELPERS */

  /** List of user's distinct sightings with oldest sighting date. */
  async getLocationsWithSightings(
    userId: number,
    sortBy: string,
    page: number,
  ): Promise<Locations[]> {
    return this.databaseService.$queryRaw(
      getLocationsWithSightings(userId, sortBy, page),
    );
  }
}
