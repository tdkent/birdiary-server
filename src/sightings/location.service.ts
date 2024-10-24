import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LocationDto } from './dto/create-location.dto';
import { DatabaseService } from '../database/database.service';
import ErrorMessages from '../common/errors/errors.enum';

@Injectable()
export class LocationService {
  constructor(private readonly databaseService: DatabaseService) {}

  //---- CREATE NEW LOCATION IF IT DOES NOT EXIST, RETURN ID
  async upsert(locationDto: LocationDto) {
    return this.databaseService.location
      .upsert({
        where: {
          name: locationDto.name,
        },
        update: {},
        create: {
          ...locationDto,
        },
        select: { id: true },
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  //---- GET SINGLE LOCATION
  //? All locations will be generated by Google Places API
  async findOne(locationId: number) {
    return this.databaseService.location
      .findUniqueOrThrow({
        where: { id: locationId },
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

  //---- UPDATE SINGLE LOCATION
  //? Upserts the location and changes location id of user's related sightings
  async update(userId: number, locationId: number, locationDto: LocationDto) {
    try {
      const newLocationId = await this.upsert(locationDto);
      return this.databaseService.sighting.updateMany({
        where: {
          user_id: userId,
          location_id: locationId,
        },
        data: {
          location_id: newLocationId.id,
        },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }
}
