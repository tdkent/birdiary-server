import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  AuthDto,
  AuthWithSightingsDto,
  UpdateUserProfileDto,
  UpdateUserPasswordDto,
  UserIdDto,
} from 'src/users/dto/user.dto';
import AuthGuard from '../common/guard/auth.guard';
import CurrentUser from 'src/common/decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** POST '/users/signup' - Sign up user */
  @Post('signup')
  signup(@Body(ValidationPipe) reqBody: AuthDto) {
    return this.usersService.signup(reqBody);
  }

  /** POST '/users/signin' - Sign in user */
  @Post('signin')
  @HttpCode(200)
  signin(@Body(ValidationPipe) reqBody: AuthWithSightingsDto) {
    return this.usersService.signin(reqBody);
  }

  /** GET '/users/:id' - Get user by id */
  @UseGuards(AuthGuard)
  @Get(':id')
  getUserById(
    @CurrentUser('id') id: number,
    @Param(new ValidationPipe()) params: UserIdDto,
  ) {
    return this.usersService.getUserById(id, params.id);
  }

  /** PATCH '/users/:id' - Update user */
  @UseGuards(AuthGuard)
  @Patch(':id')
  updateUser(
    @CurrentUser('id') id: number,
    @Param(new ValidationPipe()) params: UserIdDto,
    @Body(ValidationPipe) reqBody: UpdateUserProfileDto,
  ) {
    return this.usersService.updateUser(id, params.id, reqBody);
  }

  /** DELETE '/users/:id' - Delete user */
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteUser(
    @CurrentUser('id') id: number,
    @Param(new ValidationPipe()) params: UserIdDto,
  ) {
    return this.usersService.deleteUser(id, params.id);
  }

  /** PATCH '/users/:id/password' - Update user's password */
  @UseGuards(AuthGuard)
  @Patch(':id/password')
  updateUserPassword(
    @CurrentUser('id') id: number,
    @Param(new ValidationPipe()) params: UserIdDto,
    @Body(ValidationPipe) reqBody: UpdateUserPasswordDto,
  ) {
    return this.usersService.updateUserPassword(id, params.id, reqBody);
  }
}
