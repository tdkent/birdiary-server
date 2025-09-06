import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CreateLocationDto,
  GetLocationsDto,
} from '../locations/dto/location.dto';
import { DatabaseService } from '../database/database.service';
import { ErrorMessages, ListWithCount, Location } from '../common/models';
import { TAKE_COUNT } from '../common/constants';

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
  ): Promise<ListWithCount<Location & { count: number }>> {
    const { page, sortBy } = reqQuery;
    try {
      const count = await this.databaseService.location.count({
        where: { userId },
      });
      const locations = await this.databaseService.location.findMany({
        where: { userId },
        include: {
          _count: { select: { sightings: true } },
        },
        orderBy:
          sortBy === 'alphaAsc'
            ? [{ name: 'asc' }]
            : sortBy === 'alphaDesc'
              ? [{ name: 'desc' }]
              : [{ sightings: { _count: 'desc' } }, { name: 'asc' }],
        take: TAKE_COUNT,
        skip: TAKE_COUNT * (page - 1),
      });
      const updateToListWithCount = {
        countOfRecords: count,
        data: locations.map(({ _count, ...rest }) => {
          return { count: _count.sightings, ...rest };
        }),
      };
      return updateToListWithCount;
    } catch (err) {
      console.error(err);
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
}
