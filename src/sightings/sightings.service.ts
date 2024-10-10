import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateSightingDto } from './dto/create-sighting.dto';
import { UpdateSightingDto } from './dto/update-sighting.dto';

@Injectable()
export class SightingsService {
  constructor(private readonly databaseService: DatabaseService) {}
  //---- CREATE NEW SIGHTING
  async create(id: number, createSightingDto: CreateSightingDto) {
    return this.databaseService.sighting
      .create({
        data: { user_id: id, ...createSightingDto },
      })
      .catch(() => {
        throw new InternalServerErrorException('An error occurred');
      });
  }

  //---- FETCH ALL SIGHTINGS BY USER
  async findAll(id: number) {
    return this.databaseService.sighting
      .findMany({
        where: { user_id: id },
      })
      .catch(() => {
        throw new InternalServerErrorException('An error occurred');
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
            throw new NotFoundException('Resource or user does not exist');
          }
        }
        throw new InternalServerErrorException('An error occurred');
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
          throw new NotFoundException('Resource or user does not exist');
        }
        throw new InternalServerErrorException('An error occurred');
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
          throw new NotFoundException('Resource or user does not exist');
        }
        throw new InternalServerErrorException('An error occurred');
      });
  }
}
