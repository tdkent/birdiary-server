import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dtos/create-user.dto';
import { DatabaseService } from '../database/database.service';
import ErrorMessages from '../common/errors/errors.enum';
import { comparePassword } from 'src/common/helpers/auth.helpers';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  //---- SIGN IN A USER. ERROR ON FAIL, TOKEN ON SUCCESS.
  async signin(loginUser: CreateUserDto) {
    try {
      const user = await this.databaseService.user.findUniqueOrThrow({
        where: { email: loginUser.email },
      });

      const comparePasswords = await comparePassword(
        loginUser.password,
        user.password,
      );
      if (!comparePasswords) {
        throw new BadRequestException();
      }

      return { id: user.userId };
    } catch (err) {
      console.log(err);
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
