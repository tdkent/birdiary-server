import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SightingsService } from './sightings.service';
import { CreateSightingDto } from './dto/create-sighting.dto';
import { UpdateSightingDto } from './dto/update-sighting.dto';

@Controller('sightings')
export class SightingsController {
  constructor(private readonly sightingsService: SightingsService) {}

  //---- POST '/sightings' :: Create a new bird sighting
  @Post()
  create(@Body() createSightingDto: CreateSightingDto) {
    return this.sightingsService.create(createSightingDto);
  }

  //---- GET '/sightings' :: Fetch all user's sightings
  @Get()
  findAll() {
    return this.sightingsService.findAll();
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
