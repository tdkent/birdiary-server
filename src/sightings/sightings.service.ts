import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { LocationService } from './location.service';
import { CreateSightingDto } from './dto/create-sighting.dto';
import { UpdateSightingDto } from './dto/update-sighting.dto';
import { GetSightingsDto } from './dto/get-sightings.dto';
import ErrorMessages from 'src/common/errors/errors.enum';

@Injectable()
export class SightingsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly locationService: LocationService,
  ) {}
  //---- CREATE NEW SIGHTING
  async create(id: number, createSightingDto: CreateSightingDto) {
    const { bird_id, date, desc, location } = createSightingDto;

    if (location) {
      await this.locationService.create(id, location);
    }

    return this.databaseService.sighting
      .create({
        data: {
          user_id: id,
          bird_id,
          date,
          desc,
          location_name: location?.name || null,
        },
        include: { location: true },
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  //---- FETCH ALL SIGHTINGS BY USER
  async findAll(id: number, query?: GetSightingsDto) {
    const queryFilter = query.get ?? null;

    try {
      //---- RETURN USER'S LIFELIST
      if (queryFilter === 'lifelist') {
        return this.databaseService.sighting.findMany({
          where: { user_id: id },
          distinct: ['bird_id'],
        });
      }

      //---- RETURN ALL USER'S SIGHTINGS
      return this.databaseService.sighting.findMany({
        where: { user_id: id },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }

  //---- RETURN SIGHTINGS COUNT BY LOCATION
  async groupAllLocations(userId: number) {
    return this.databaseService.sighting
      .groupBy({
        by: ['location_name'],
        where: { user_id: userId },
        _count: {
          _all: true,
        },
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  async findSightingsBySingleLocation(userId: number, location: string) {
    return this.databaseService.sighting
      .findMany({
        where: {
          user_id: userId,
          location_name: location,
        },
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  //---- FETCH A SIGHTING
  async findOne(userId: number, sightingId: number) {
    return this.databaseService.sighting
      .findFirstOrThrow({
        where: {
          AND: [{ user_id: userId }, { id: sightingId }],
        },
      })
      .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            throw new NotFoundException(ErrorMessages.ResourceNotFound);
          }
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  //---- UPDATE A SIGHTING
  // result is an object with updated count :: { count: 0 } or { count: 1 }
  //? updateMany is required to have multiple WHERE clauses
  async update(
    userId: number,
    sightingId: number,
    updateSightingDto: UpdateSightingDto,
  ) {
    return this.databaseService.sighting
      .updateMany({
        data: updateSightingDto,
        where: { id: sightingId, user_id: userId },
      })
      .then((res) => {
        if (!res.count) {
          throw new NotFoundException();
        }
        return res;
      })
      .catch((err) => {
        if (err instanceof NotFoundException) {
          throw new NotFoundException(ErrorMessages.ResourceNotFound);
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  //---- DELETE A SIGHTING
  // result is an object with updated count :: { count: 0 } or { count: 1 }
  //? deleteMany is required to have multiple WHERE clauses
  async remove(userId: number, sightingId: number) {
    return this.databaseService.sighting
      .deleteMany({
        where: { id: sightingId, user_id: userId },
      })
      .then((res) => {
        if (!res.count) {
          throw new NotFoundException();
        }
        return res;
      })
      .catch((err) => {
        if (err instanceof NotFoundException) {
          throw new NotFoundException(ErrorMessages.ResourceNotFound);
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  findAllLocations() {
    return this.databaseService.location.findMany();
  }
}
