import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { LocationService } from './location.service';
import { CreateSightingDto } from './dto/create-sighting.dto';
import { UpdateSightingDto } from './dto/update-sighting.dto';
import { GroupSightingDto } from './dto/group-sighting.dto';
import { GetSightingByDateDto } from './dto/get-sighting-by-date.dto';
import { UpdateSighting } from '../common/models/update-sighting.model';
import ErrorMessages from '../common/errors/errors.enum';

@Injectable()
export class SightingsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly locationService: LocationService,
  ) {}
  //---- CREATE NEW SIGHTING
  async create(id: number, createSightingDto: CreateSightingDto) {
    const { bird_id, date, desc, location } = createSightingDto;
    let locationId: { id: number } | null = null;

    if (location) {
      locationId = await this.locationService.upsertUserLocation(id, location);
    }

    return this.databaseService.sighting
      .create({
        data: {
          user_id: id,
          bird_id,
          date,
          desc,
          location_id: locationId?.id || null,
        },
        include: { location: true },
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  //---- GET ALL USER'S SIGHTINGS
  async findAllOrGroup(id: number, query: GroupSightingDto) {
    try {
      if (query.groupby) {
        return this.databaseService.sighting.groupBy({
          by:
            query.groupby === 'date'
              ? ['date']
              : query.groupby === 'bird_id'
                ? ['bird_id']
                : ['location_id'],
          where: { user_id: id },
          _count: { _all: true },
        });
      }
      return this.databaseService.sighting.findMany({
        where: { user_id: id },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }

  //---- FIND USER'S LIFE LIST
  async findLifeList(id: number) {
    return this.databaseService.sighting
      .findMany({
        where: { user_id: id },
        distinct: ['bird_id'],
        orderBy: {
          date: 'asc',
        },
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  //---- FIND ALL USER'S SIGHTINGS BY SINGLE DATE
  async findSightingsBySingleDate(userId: number, date: GetSightingByDateDto) {
    return this.databaseService.sighting
      .findMany({
        where: {
          user_id: userId,
          date: date.date,
        },
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  //---- FIND ALL USER'S SIGHTINGS BY SINGLE LOCATION
  //? Location may exist but have no associated sightings (no error)
  //? Location may not exist or may not be associated with requesting user (error)
  async findSightingsBySingleLocation(userId: number, locationId: number) {
    try {
      // Check if the location exists
      const locationData = await this.databaseService.location.findFirstOrThrow(
        { where: { id: locationId } },
      );

      // Check if the location is related to the current user
      if (locationData.user_id !== userId) {
        throw new ForbiddenException();
      }

      return this.databaseService.sighting.findMany({
        where: {
          user_id: userId,
          location_id: locationId,
        },
      });
    } catch (err) {
      console.log(err);
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException(ErrorMessages.ResourceNotFound);
        }
      }
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(ErrorMessages.AccessForbidden);
      }
      throw new InternalServerErrorException(ErrorMessages.DefaultServer);
    }
  }

  //---- FIND A SINGLE SIGHTING
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
  //? using updateMany in order to have multiple WHERE clauses
  async update(
    userId: number,
    sightingId: number,
    updateSightingDto: UpdateSightingDto,
  ) {
    const { location, ...requestData } = updateSightingDto;
    const updateSightingData: UpdateSighting = requestData;
    let locationId: { id: number } | null = null;

    if (location) {
      locationId = await this.locationService.upsertUserLocation(
        userId,
        location,
      );
      updateSightingData['location_id'] = locationId.id;
    }

    return this.databaseService.sighting
      .updateMany({
        data: {
          ...updateSightingData,
        },
        where: { id: sightingId, user_id: userId },
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

  //---- DELETE A SIGHTING
  // result is an object with updated count :: { count: 0 } or { count: 1 }
  //? using deleteMany in order to have multiple WHERE clauses
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
}
