import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  //---- UPDATE SINGLE LOCATION
  async updateLocation(
    userId: number,
    locationId: number,
    locationDto: LocationDto,
  ) {
    return this.databaseService.location
      .updateMany({
        where: {
          user_id: userId,
          id: locationId,
        },
        data: {
          ...locationDto,
        },
      })
      .then((res) => {
        if (!res.count) {
          throw new NotFoundException();
        }
        return res;
      })
      .catch((err) => {
        console.log(err);
        if (err instanceof NotFoundException) {
          throw new NotFoundException(ErrorMessages.ResourceNotFound);
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }
}
