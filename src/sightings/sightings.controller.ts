import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sightingsService.findOne(+id);
  }

  //---- PATCH 'sightings/:id' :: Update a single sighting
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSightingDto: UpdateSightingDto,
  ) {
    return this.sightingsService.update(+id, updateSightingDto);
  }

  //---- DELETE 'sightings/:id' :: Delete a single sighting
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sightingsService.remove(+id);
  }
}
