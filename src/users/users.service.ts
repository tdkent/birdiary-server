import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  create(createUserDto: Prisma.UserCreateInput) {
    return createUserDto;
  }
}
