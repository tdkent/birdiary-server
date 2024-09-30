import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  // Inject UsersService dependency
  constructor(private readonly usersService: UsersService) {}

  @Post() // POST /users
  create(@Body() createUserDto: { email: string; password: string }) {
    return this.usersService.create(createUserDto);
  }
}
