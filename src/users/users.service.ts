import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import {
  AuthDto,
  AuthWithSightingsDto,
  UpdateUserProfileDto,
  UpdateUserPasswordDto,
} from 'src/users/dto/user.dto';
import { hashPassword, comparePassword } from '../common/helpers';
import { ErrorMessages } from 'src/common/models';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  /** Create a new user. */
  async signup(reqBody: AuthDto) {
    return await this.databaseService.user
      .create({
        data: {
          email: reqBody.email,
          password: await hashPassword(reqBody.password),
        },
        select: { id: true },
      })
      .catch((err) => {
        console.error(err);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            throw new BadRequestException(ErrorMessages.EmailIsRegistered);
          }
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  /** Confirm user credentials and send token. */
  async signin(reqBody: AuthWithSightingsDto) {
    const { email, password, storageData } = reqBody;
    try {
      const user = await this.databaseService.user.findUniqueOrThrow({
        where: { email },
      });

      const comparePasswords = await comparePassword(password, user.password);
      if (!comparePasswords) {
        throw new BadRequestException();
      }

      let count = null;
      if (storageData && storageData.length) {
        const addUserId = storageData.map((sighting) => {
          return { userId: user.id, ...sighting };
        });
        const addSightings = await this.databaseService.sighting.createMany({
          data: addUserId,
        });
        count = addSightings.count;
      }

      return { id: user.id, count };
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

  /** Get user by id. Includes sighting count, omits password. */
  async getUserById(id: number) {
    return this.databaseService.user
      .findUniqueOrThrow({
        where: { id },
        omit: { password: true },
        include: { sightings: true },
      })
      .then((res) => {
        // Prisma cannot combine `_count` and `distinct`
        // https://github.com/prisma/prisma/issues/4228
        //? Replace with raw query
        const { sightings, ...rest } = res;
        const totalSightings = sightings.length;
        const totalDistinctSightings = new Set(
          sightings.map((sighting) => sighting.id),
        ).size;

        const response = {
          ...rest,
          count: {
            totalSightings,
            totalDistinctSightings,
          },
        };
        return response;
      })
      .catch((err) => {
        console.error(err);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            throw new NotFoundException(ErrorMessages.UserNotFound);
          }
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  /** Update user's name, location, favorite bird. */
  async updateUser(id: number, reqBody: UpdateUserProfileDto) {
    await this.databaseService.user
      .update({
        where: { id },
        data: { ...reqBody },
        select: { id: true },
      })
      .catch((err) => {
        console.error(err);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            throw new NotFoundException(ErrorMessages.UserNotFound);
          }
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });

    return { message: 'ok' };
  }

  /** Update user's password */
  async updateUserPassword(id: number, reqBody: UpdateUserPasswordDto) {
    const { currentPassword, newPassword } = reqBody;
    try {
      const { password } = await this.databaseService.user.findUniqueOrThrow({
        where: { id },
        select: { password: true },
      });

      const isValid = await comparePassword(currentPassword, password);
      if (!isValid) {
        throw new BadRequestException();
      }

      const hashNewPassword = await hashPassword(newPassword);
      await this.databaseService.user.update({
        where: { id },
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

  /** Delete user. Cascades to sightings. */
  async deleteUser(id: number) {
    return this.databaseService.user
      .delete({
        where: { id },
      })
      .catch((err) => {
        //? Note: Prisma delete bad error: https://github.com/prisma/prisma/issues/4072
        console.error(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }
}
