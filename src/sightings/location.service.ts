import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LocationDto } from './dto/create-location.dto';
import { DatabaseService } from 'src/database/database.service';
import ErrorMessages from 'src/common/errors/errors.enum';

@Injectable()
export class LocationService {
  constructor(private readonly databaseService: DatabaseService) {}

  //---- CREATE NEW LOCATION IF IT DOES NOT EXIST, RETURN ID
  async upsertUserLocation(userId: number, locationDto: LocationDto) {
    return this.databaseService.location
      .upsert({
        where: {
          user_id: userId,
          name: locationDto.name,
        },
        update: {},
        create: {
          user_id: userId,
          ...locationDto,
        },
        select: { id: true },
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }
}
