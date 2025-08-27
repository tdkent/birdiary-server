import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CreateLocationDto,
  UpsertLocationDto,
} from '../locations/dto/location.dto';
import { DatabaseService } from '../database/database.service';
import { ErrorMessages, Location } from '../common/models';

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
    return this.databaseService.location
      .findUniqueOrThrow({ where: { id: locationId, userId } })
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

  /** Upsert location and update user's related sightings. */
  async updateLocation(
    userId: number,
    locationId: number,
    reqBody: UpsertLocationDto,
  ): Promise<Location> {
    return this.databaseService.location
      .update({
        where: { id: locationId, userId },
        data: reqBody,
      })
      .catch((err) => {
        console.error(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  /**
   * Delete location from user's sightings.
   * Location remains in database.
   */
  async deleteLocation(userId: number, locationId: number): Promise<Location> {
    return this.databaseService.location
      .delete({
        where: { userId, id: locationId },
      })
      .catch((err) => {
        console.error(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }
}
