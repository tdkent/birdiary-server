import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { UpdatePasswordDto } from 'src/users/dtos/update-password.dto';
import ErrorMessages from '../common/errors/errors.enum';
import { hashPassword, comparePassword } from 'src/common/helpers/auth.helpers';

@Injectable()
export class ProfileService {
  constructor(private readonly databaseService: DatabaseService) {}

  //---- FIND USER BY ID
  async findById(id: string) {
    return this.databaseService.user
      .findUniqueOrThrow({
        where: { userId: id },
        select: {
          createdAt: true,
          email: true,
          profile: {
            select: {
              name: true,
              location: true,
            },
          },
          favBird: {
            select: {
              bird: {
                select: {
                  id: true,
                  commName: true,
                },
              },
            },
          },
          // Fetch all sightings for aggregations
          // Note: Prisma cannot combine `_count` and `distinct`
          sightings: true,
        },
      })
      .then((res) => {
        const { sightings, favBird, ...rest } = res;
        // Total all sightings
        const totalSightings = sightings.length;
        // Total distinct sightings
        const totalDistinctSightings = new Set(
          sightings.map((sighting) => sighting.commName),
        ).size;

        const response = {
          ...rest,
          favoriteBird: favBird.bird,
          count: {
            totalSightings,
            totalDistinctSightings,
          },
        };
        return response;
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

  //---- UPDATE USER PASSWORD
  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const { currentPassword, newPassword } = updatePasswordDto;
    try {
      const { password } = await this.databaseService.user.findUniqueOrThrow({
        where: { userId: id },
        select: { password: true },
      });

      const isValid = await comparePassword(currentPassword, password);
      if (!isValid) {
        throw new BadRequestException();
      }

      const hashNewPassword = await hashPassword(newPassword);
      await this.databaseService.user.update({
        where: { userId: id },
        data: { password: hashNewPassword },
      });

      return { message: 'ok' };
    } catch (err) {
      console.error(err);
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException(ErrorMessages.UserNotFound);
        }
      } else if (err instanceof BadRequestException) {
        throw new BadRequestException(ErrorMessages.IncorrectPassword);
      } else {
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      }
    }
  }

  //---- UPDATE USER PROFILE
  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    await this.databaseService.profile
      .update({
        where: { userId: id },
        data: updateProfileDto,
        select: { userId: true },
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

    return { message: 'ok' };
  }

  //---- UPSERT FAVORITE BIRD
  async updateFavoriteBird(id: string, birdId: number) {
    return this.databaseService.favorite
      .update({
        where: { userId: id },
        data: { birdId: birdId },
        select: { birdId: true },
      })
      .catch((err) => {
        console.log(err);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2003') {
            throw new BadRequestException(ErrorMessages.BadRequest);
          }
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }
}
