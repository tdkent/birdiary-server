import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { compare } from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { UsersService } from '../users/users.service';
import ErrorMessages from 'src/common/errors/errors.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
  ) {}

  //---- SIGN IN A USER. ERROR ON FAIL, TOKEN ON SUCCESS.
  async signin(loginUser: CreateUserDto) {
    try {
      const user = await this.databaseService.user.findUniqueOrThrow({
        where: { email: loginUser.email },
      });

      const comparePasswords = await compare(loginUser.password, user.password);
      if (!comparePasswords) {
        throw new BadRequestException();
      }

      const payload = { id: user.id, email: user.email };
      const token = await this.jwtService.signAsync(payload);
      return { id: user.id, email: user.email, token };
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
