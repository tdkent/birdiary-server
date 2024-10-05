import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  findOne(@CurrentUser('id') id: number) {
    return this.usersService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Patch('/profile')
  update(
    @CurrentUser('id') id: number,
    @Body(ValidationPipe) updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.update(id, updateProfileDto);
  }

  @UseGuards(AuthGuard)
  @Delete('/profile')
  remove(@CurrentUser('id') id: number) {
    return this.usersService.remove(id);
  }
}
