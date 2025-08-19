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
  UpdateUserProfileDto,
  UpdateUserPasswordDto,
} from '../users/dto/user.dto';
import { CreateSightingDto } from '../sightings/dto/sighting.dto';
import AuthGuard from '../common/guard/auth.guard';
import CurrentUser from '../common/decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** GET '/users' - Get user */
  @UseGuards(AuthGuard)
  @Get()
  getUserById(@CurrentUser('id') id: number) {
    return this.usersService.getUserById(id);
  }

  /** PATCH '/users' - Update user */
  @UseGuards(AuthGuard)
  @Patch()
  updateUser(
    @CurrentUser('id') id: number,
    @Body(ValidationPipe) reqBody: UpdateUserProfileDto,
  ) {
    return this.usersService.updateUser(id, reqBody);
  }

  /** DELETE '/users' - Delete user */
  @UseGuards(AuthGuard)
  @Delete()
  deleteUser(@CurrentUser('id') id: number) {
    return this.usersService.deleteUser(id);
  }

  /** POST '/users/signup' - Sign up user */
  @Post('signup')
  signup(@Body(ValidationPipe) reqBody: AuthDto) {
    return this.usersService.signup(reqBody);
  }

  /** POST '/users/signin' - Sign in user */
  @Post('signin')
  @HttpCode(200)
  signin(@Body(ValidationPipe) reqBody: AuthDto) {
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

  /** POST '/users/transferstorage' - Add sightings data */
  @UseGuards(AuthGuard)
  @Post('transferstorage')
  transferStorage(
    @CurrentUser('id') id: number,
    @Body(ValidationPipe) reqBody: CreateSightingDto[],
  ) {
    return this.usersService.transferStorage(id, reqBody);
  }
}
