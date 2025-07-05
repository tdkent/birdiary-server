import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LocationDto } from '../locations/dto/location.dto';
import { DatabaseService } from '../database/database.service';
import ErrorMessages from '../common/errors/errors.enum';

@Injectable()
export class LocationService {
  constructor(private readonly databaseService: DatabaseService) {}

  /** Create location using upsert method. */
  async createLocation(locationDto: LocationDto) {
    return this.databaseService.location
      .upsert({
        where: { name: locationDto.name },
        update: {},
        create: {
          ...locationDto,
        },
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  /** Get location. */
  async getLocation(id: number) {
    return this.databaseService.location
      .findUniqueOrThrow({ where: { id } })
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

  /** Upsert location and update user's related sightings. */
  async updateLocation(
    userId: number,
    locationId: number,
    locationDto: LocationDto,
  ) {
    try {
      const location = await this.createLocation(locationDto);
      // Returns { count: number }
      await this.databaseService.sighting.updateMany({
        where: { userId, locationId },
        data: { locationId: location.id },
      });
      return { message: 'ok', location };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }

  /**
   * Delete location from user's sightings.
   * Location remains in database.
   */
  async deleteLocation(userId: number, locationId: number) {
    try {
      const count = await this.databaseService.sighting.updateMany({
        where: { userId, locationId },
        data: { locationId: null },
      });
      return { message: 'ok', count };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }
}
