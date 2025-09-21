import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { comparePassword, hashPassword } from '../common/helpers';
import { ErrorMessages, type User } from '../common/models';
import { DatabaseService } from '../database/database.service';
import { CreateSightingDto } from '../sightings/dto/sighting.dto';
import {
  AuthDto,
  UpdateUserPasswordDto,
  UpdateUserProfileDto,
} from '../users/dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  /** Create a new user. */
  async signup(reqBody: AuthDto): Promise<{ id: number }> {
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
  async signin(reqBody: AuthDto): Promise<{ id: number }> {
    const { email, password } = reqBody;
    try {
      const user = await this.databaseService.user.findUniqueOrThrow({
        where: { email },
      });

      const comparePasswords = await comparePassword(password, user.password);
      if (!comparePasswords) {
        throw new BadRequestException();
      }

      return { id: user.id };
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
  async getUserById(id: number): Promise<
    Omit<User, 'password'> & {
      count: {
        totalSightings: number;
        totalDistinctSightings: number;
      };
    }
  > {
    return this.databaseService.user
      .findUniqueOrThrow({
        where: { id },
        omit: { password: true },
        include: { sightings: true, bird: true },
      })
      .then((res) => {
        const { sightings, ...rest } = res;
        const totalSightings = sightings.length;
        const totalDistinctSightings = new Set(
          sightings.map((sighting) => sighting.id),
        ).size;
        return {
          ...rest,
          count: {
            totalSightings,
            totalDistinctSightings,
          },
        };
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
  async updateUser(
    id: number,
    reqBody: UpdateUserProfileDto,
  ): Promise<Omit<User, 'password'>> {
    if (
      (reqBody.zipcode && !reqBody.address) ||
      (!reqBody.zipcode && reqBody.address)
    )
      throw new BadRequestException();
    return this.databaseService.user
      .update({
        where: { id },
        data: { ...reqBody },
        omit: { password: true },
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

  /** Update user's password */
  async updateUserPassword(
    id: number,
    reqBody: UpdateUserPasswordDto,
  ): Promise<Omit<User, 'password'>> {
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
      return this.databaseService.user.update({
        where: { id },
        data: { password: hashNewPassword },
        omit: { password: true },
      });
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
  async deleteUser(id: number): Promise<Omit<User, 'password'>> {
    return this.databaseService.user
      .delete({
        where: { id },
        omit: { password: true },
      })
      .catch((err) => {
        //? Note: Prisma delete bad error: https://github.com/prisma/prisma/issues/4072
        console.error(err);
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  /** Add sightings from user's browser cache. */
  async transferStorage(
    id: number,
    reqBody: CreateSightingDto[],
  ): Promise<{ count: number }> {
    try {
      let count = null;
      const addUserId = reqBody.map((sighting) => {
        return {
          userId: id,
          birdId: sighting.birdId,
          date: sighting.date,
          description: sighting.description,
        };
      });
      const addSightings = await this.databaseService.sighting.createMany({
        data: addUserId,
      });
      count = addSightings.count;
      return { count };
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
}
