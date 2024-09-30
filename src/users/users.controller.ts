import { Body, Controller, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  // Inject UsersService dependency
  constructor(private readonly usersService: UsersService) {}

  @Post() // POST /users
  create(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.usersService.create(createUserDto);
  }
}
