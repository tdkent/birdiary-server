import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LocationDto } from './dto/create-sighting.dto';
import { DatabaseService } from 'src/database/database.service';
import ErrorMessages from 'src/common/errors/errors.enum';

@Injectable()
export class LocationService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(id: number, locationDto: LocationDto) {
    return this.databaseService.location
      .upsert({
        where: {
          locId: {
            user_id: id,
            name: locationDto.name,
          },
        },
        update: {},
        create: { user_id: id, ...locationDto },
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }
}
