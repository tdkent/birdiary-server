import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SightingsService } from './sightings.service';
import { CreateSightingDto } from './dto/create-sighting.dto';
import { UpdateSightingDto } from './dto/update-sighting.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('sightings')
export class SightingsController {
  constructor(private readonly sightingsService: SightingsService) {}

  //---- POST '/sightings' :: Create a new bird sighting
  @UseGuards(AuthGuard)
  @Post()
  create(
    @CurrentUser('id') id: number,
    @Body(ValidationPipe) createSightingDto: CreateSightingDto,
  ) {
    return this.sightingsService.create(id, createSightingDto);
  }

  //---- GET '/sightings' :: Fetch all user's sightings
  @UseGuards(AuthGuard)
  @Get()
  findAll(@CurrentUser('id') id: number) {
    return this.sightingsService.findAll(id);
  }

  //---- GET '/sightings/:id' :: Fetch a single sighting
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) sightingId: number,
  ) {
    return this.sightingsService.findOne(userId, sightingId);
  }

  //---- PATCH 'sightings/:id' :: Update a single sighting
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) sightingId: number,
    @Body() updateSightingDto: UpdateSightingDto,
  ) {
    return this.sightingsService.update(userId, sightingId, updateSightingDto);
  }

  //---- DELETE 'sightings/:id' :: Delete a single sighting
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sightingsService.remove(+id);
  }
}
