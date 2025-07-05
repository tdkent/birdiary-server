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
} from 'src/users/dto/user.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

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
  getUserById(@CurrentUser('id') id: number) {
    return this.usersService.getUserById(id);
  }

  /** PATCH '/users/:id' - Update user */
  @UseGuards(AuthGuard)
  @Patch(':id')
  updateUser(
    @CurrentUser('id') id: number,
    @Body(ValidationPipe) reqBody: UpdateUserProfileDto,
  ) {
    return this.usersService.updateUser(id, reqBody);
  }

  /** DELETE '/users/:id' - Delete user */
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteUser(@CurrentUser('id') id: number) {
    return this.usersService.deleteUser(id);
  }

  /** PATCH '/users/:id/password' - Update user's password */
  @UseGuards(AuthGuard)
  @Patch(':id/password')
  updateUserPassword(
    @CurrentUser('id') id: number,
    @Body(ValidationPipe) reqBody: UpdateUserPasswordDto,
  ) {
    return this.usersService.updateUserPassword(id, reqBody);
  }
}
