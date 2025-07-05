import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
// import { ProfileService } from './profile.service';
// import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { UpdatePasswordDto } from 'src/users/dtos/update-password.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(
    // private readonly profileService: ProfileService,
    private readonly usersService: UsersService,
    // private readonly authService: AuthService,
  ) {}

  /** POST '/users/signup' - Sign up user */
  @Post('signup')
  signup(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.signup(createUserDto);
  }

  /** POST '/users/signin' - Sign in user */
  @Post('signin')
  @HttpCode(200)
  signin(@Body(ValidationPipe) loginUser: CreateUserDto) {
    return this.usersService.signin(loginUser);
  }

  /** GET '/users/:id' - Get user by id */
  @UseGuards(AuthGuard)
  @Get(':id')
  getUserById(@CurrentUser('id') id: number) {
    return this.usersService.getUserById(id);
  }

  /** PUT '/users/:id' - Update user */
  @UseGuards(AuthGuard)
  @Put(':id')
  updateUser(
    @CurrentUser('id') id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  /** DELETE '/users/:id' - Delete user */
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteUser(@CurrentUser('id') id: number) {
    return this.usersService.deleteUser(id);
  }

  /** PUT '/users/:id' - Update user's password */
  @UseGuards(AuthGuard)
  @Put(':id/password')
  updateUserPassword(
    @CurrentUser('id') id: number,
    @Body(ValidationPipe) updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updateUserPassword(id, updatePasswordDto);
  }
}
