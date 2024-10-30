import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import ErrorMessages from '../common/errors/errors.enum';

@Injectable()
export class ProfileService {
  constructor(private readonly databaseService: DatabaseService) {}

  //---- FIND USER BY ID
  async findById(id: number) {
    return this.databaseService.user
      .findUniqueOrThrow({
        where: { id },
        select: {
          email: true,
          created_at: true,
          profile: {
            select: {
              user_id: true,
              name: true,
              location: true,
            },
          },
          fav_bird: {
            select: {
              bird: {
                select: {
                  id: true,
                  comm_name: true,
                },
              },
            },
          },
        },
      })
      .catch((err) => {
        console.log(err);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            throw new NotFoundException(ErrorMessages.UserNotFound);
          }
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  //---- UPDATE USER PROFILE
  async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    return this.databaseService.profile
      .update({
        where: { user_id: id },
        data: updateProfileDto,
        select: { name: true, location: true },
      })
      .catch((err) => {
        console.log(err);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025') {
              throw new NotFoundException(ErrorMessages.UserNotFound);
            }
          }
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  //---- UPSERT FAVORITE BIRD
  async updateFavoriteBird(id: number, birdId: number) {
    return this.databaseService.favorite
      .update({
        where: { user_id: id },
        data: { bird_id: birdId },
        select: { bird_id: true },
      })
      .catch((err) => {
        console.log(err);
        //? foreign key constraint error throws while using partial birds db
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2003') {
            throw new BadRequestException(ErrorMessages.BadRequest);
          }
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }
}
