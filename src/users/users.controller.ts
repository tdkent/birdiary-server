import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
} from '../users/dto/user.dto';
import AuthGuard from '../common/guard/auth.guard';
import CurrentUser from '../common/decorators';

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

  /** PATCH '/users/password' - Update user's password */
  @UseGuards(AuthGuard)
  @Patch('password')
  updateUserPassword(
    @CurrentUser('id') id: number,
    @Body(ValidationPipe) reqBody: UpdateUserPasswordDto,
  ) {
    return this.usersService.updateUserPassword(id, reqBody);
  }

  /** GET '/users/profile' - Get user by id */
  @UseGuards(AuthGuard)
  @Get('profile')
  getUserById(@CurrentUser('id') id: number) {
    return this.usersService.getUserById(id);
  }

  /** PATCH '/users/profile' - Update user */
  @UseGuards(AuthGuard)
  @Patch('profile')
  updateUser(
    @CurrentUser('id') id: number,
    @Body(ValidationPipe) reqBody: UpdateUserProfileDto,
  ) {
    return this.usersService.updateUser(id, reqBody);
  }

  /** DELETE '/users/profile' - Delete user */
  @UseGuards(AuthGuard)
  @Delete('profile')
  deleteUser(@CurrentUser('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}
