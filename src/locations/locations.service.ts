import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpsertLocationDto } from '../locations/dto/location.dto';
import { DatabaseService } from '../database/database.service';
import { ErrorMessages, Location } from 'src/common/models';

@Injectable()
export class LocationService {
  constructor(private readonly databaseService: DatabaseService) {}

  /** Create location using upsert method. */
  async createLocation(reqBody: UpsertLocationDto) {
    return this.databaseService.location
      .upsert({
        where: { name: reqBody.name },
        update: {},
        create: {
          ...reqBody,
        },
      })
      .catch((err) => {
        console.error(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  /** Get location. */
  async getLocation(id: number): Promise<Location> {
    return this.databaseService.location
      .findUniqueOrThrow({ where: { id } })
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
    try {
      const location = await this.createLocation(reqBody);
      await this.databaseService.sighting.updateMany({
        where: { userId, locationId },
        data: { locationId: location.id },
      });
      return location;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }

  /**
   * Delete location from user's sightings.
   * Location remains in database.
   */
  async deleteLocation(
    userId: number,
    locationId: number,
  ): Promise<{ count: number }> {
    try {
      const count = await this.databaseService.sighting.updateMany({
        where: { userId, locationId },
        data: { locationId: null },
      });
      return count;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }
}
