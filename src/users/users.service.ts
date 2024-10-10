import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { hashPassword } from '../common/helpers/auth.helpers';
import ErrorMessages from 'src/common/errors/errors.enum';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  //---- CREATE A NEW USER W/DEFAULT PROFILE
  async create(createUserDto: CreateUserDto) {
    return await this.databaseService.user
      .create({
        data: {
          email: createUserDto.email,
          password: await hashPassword(createUserDto.password),
          profile: { create: {} },
        },
        omit: { password: true },
        include: { profile: true },
      })
      .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            throw new BadRequestException(ErrorMessages.BadRequest);
          }
        }
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }

  //---- FETCH ALL USERS
  findAll() {
    return this.databaseService.user.findMany({
      omit: { password: true },
    });
  }

  //---- DELETE USER (CASCADES PROFILE, FAVORITE)
  //? Note: Prisma throws an unhandled error when using
  //? delete method on a resource that no longer exists.
  //? https://github.com/prisma/prisma/issues/4072
  async remove(id: number) {
    return this.databaseService.user
      .delete({
        where: { id },
        select: { id: true },
      })
      .catch(() => {
        throw new InternalServerErrorException(ErrorMessages.DefaultServer);
      });
  }
}
