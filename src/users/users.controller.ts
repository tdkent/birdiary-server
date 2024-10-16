import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ProfileService } from './profile.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
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

  //---- GET '/users/profile' :: FETCH A SINGLE USER
  @UseGuards(AuthGuard)
  @Get('profile')
  findOne(@CurrentUser('id') id: number) {
    return this.profileService.findById(id);
  }

  //---- PATCH '/users/profile' :: UPDATE A SINGLE USER
  @UseGuards(AuthGuard)
  @Patch('profile')
  update(
    @CurrentUser('id') id: number,
    @Body(ValidationPipe) updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(id, updateProfileDto);
  }

  //---- PUT '/users/profile/fav' :: UPDATE USER'S FAVORITE BIRD
  @UseGuards(AuthGuard)
  @Patch('profile/fav')
  upsertFavoriteBird(
    @CurrentUser('id') id: number,
    @Query('birdid', ParseIntPipe) birdId: number,
  ) {
    return this.profileService.updateFavoriteBird(id, birdId);
  }
}
