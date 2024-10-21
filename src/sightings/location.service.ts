import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LocationDto } from './dto/create-location.dto';
import { DatabaseService } from 'src/database/database.service';
import ErrorMessages from 'src/common/errors/errors.enum';

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
