import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ProfileService } from './profile.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { UpdatePasswordDto } from 'src/users/dtos/update-password.dto';
import { UpdateFavoriteBirdDto } from './dtos/update-favorite-bird.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  /** POST '/users/signup' - Create new user */
  @Post('signup')
  signup(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /** POST '/users/signin' - Sign in user */
  @Post('signin')
  @HttpCode(200)
  signin(@Body(ValidationPipe) loginUser: CreateUserDto) {
    return this.authService.signin(loginUser);
  }

  /** GET '/users/:id' - Get user */
  @UseGuards(AuthGuard)
  @Get(':id')
  getUser(@CurrentUser('id') id: string) {
    return this.profileService.findById(id);
  }

  /** PUT '/users/:id' - Update user */
  @UseGuards(AuthGuard)
  @Put(':id')
  updateUser(
    @CurrentUser('id') id: string,
    @Body(ValidationPipe) updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(id, updateProfileDto);
  }

  /** DELETE '/users/:id' - Delete user */
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteUser(@CurrentUser('id') id: string) {
    return this.usersService.remove(id);
  }

  //---- PUT '/users/password' :: UPDATE USER PROFILE
  // @UseGuards(AuthGuard)
  // @Patch('password')
  // updatePassword(
  //   @CurrentUser('id') id: string,
  //   @Body(ValidationPipe) updatePasswordDto: UpdatePasswordDto,
  // ) {
  //   return this.profileService.updatePassword(id, updatePasswordDto);
  // }

  //---- PATCH '/users/profile/fav/:id' :: UPDATE USER'S FAVORITE BIRD
  // @UseGuards(AuthGuard)
  // @Patch('profile/fav/:id')
  // upsertFavoriteBird(
  //   @CurrentUser('id') id: string,
  //   @Param(new ValidationPipe()) params: UpdateFavoriteBirdDto,
  // ) {
  //   return this.profileService.updateFavoriteBird(id, params.id);
  // }
}
