import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly databaseService: DatabaseService) {}

  //---- FIND USER BY ID
  async findById(id: number) {
    return this.databaseService.user
      .findUniqueOrThrow({
        where: { id },
        include: {
          profile: true,
          fav_bird: {
            include: { bird: true },
            omit: { user_id: true, bird_id: true },
          },
        },
        omit: { password: true },
      })
      .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            throw new NotFoundException('User does not exist');
          }
        }
        throw new InternalServerErrorException('An unknown error occurred');
      });
  }

  //---- UPDATE USER PROFILE
  async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    return this.databaseService.profile
      .update({
        where: { user_id: id },
        data: updateProfileDto,
      })
      .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025') {
              throw new NotFoundException('User does not exist');
            }
          }
        }
        throw new InternalServerErrorException('Unknown error');
      });
  }

  //---- UPSERT FAVORITE BIRD
  async upsertFavoriteBird(id: number, birdId: number) {
    //TODO: error handling for out of range bird ids
    return this.databaseService.favorite
      .upsert({
        where: { user_id: id },
        update: { bird_id: birdId },
        create: {
          user_id: id,
          bird_id: birdId,
        },
      })
      .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2003') {
            throw new BadRequestException('Invalid request');
          }
        }
        throw new InternalServerErrorException('An unknown error occurred');
      });
  }
}
