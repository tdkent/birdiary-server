import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ProfileService } from './profile.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Delete()
  remove(@CurrentUser('id') id: number) {
    return this.usersService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  findOne(@CurrentUser('id') id: number) {
    return this.profileService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Patch('/profile')
  update(
    @CurrentUser('id') id: number,
    @Body(ValidationPipe) updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(id, updateProfileDto);
  }

  @UseGuards(AuthGuard)
  @Put('/profile/fav')
  upsertFavoriteBird(
    @CurrentUser('id') id: number,
    @Query('birdid', ParseIntPipe) birdId: number,
  ) {
    return this.profileService.upsertFavoriteBird(id, birdId);
  }
}
