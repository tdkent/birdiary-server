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
import { ProfileService } from './profile.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
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

  //---- POST '/users' :: CREATE A NEW USER
  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  //---- DELETE '/users' :: DELETE A USER
  @UseGuards(AuthGuard)
  @Delete()
  remove(@CurrentUser('id') id: number) {
    return this.usersService.remove(id);
  }

  //---- POST '/auth/signin' :: SIGN IN A USER
  @Post('auth/signin')
  @HttpCode(200)
  signin(@Body(ValidationPipe) loginUser: CreateUserDto) {
    return this.authService.signin(loginUser);
  }

  //---- GET '/users/profile' :: FETCH USER PROFILE
  @UseGuards(AuthGuard)
  @Get('profile')
  findOne(@CurrentUser('id') id: number) {
    return this.profileService.findById(id);
  }

  //---- PATCH '/users/profile' :: UPDATE USER PROFILE
  @UseGuards(AuthGuard)
  @Patch('profile')
  update(
    @CurrentUser('id') id: number,
    @Body(ValidationPipe) updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(id, updateProfileDto);
  }

  //---- PATCH '/users/profile/fav/:id' :: UPDATE USER'S FAVORITE BIRD
  @UseGuards(AuthGuard)
  @Patch('profile/fav/:id')
  upsertFavoriteBird(
    @CurrentUser('id') id: number,
    @Param(new ValidationPipe()) params: UpdateFavoriteBirdDto,
  ) {
    return this.profileService.updateFavoriteBird(id, params.id);
  }
}
