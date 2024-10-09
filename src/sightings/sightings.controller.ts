import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SightingsService } from './sightings.service';
import { CreateSightingDto } from './dto/create-sighting.dto';
import { UpdateSightingDto } from './dto/update-sighting.dto';

@Controller('sightings')
export class SightingsController {
  constructor(private readonly sightingsService: SightingsService) {}

  @Post()
  create(@Body() createSightingDto: CreateSightingDto) {
    return this.sightingsService.create(createSightingDto);
  }

  @Get()
  findAll() {
    return this.sightingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sightingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSightingDto: UpdateSightingDto) {
    return this.sightingsService.update(+id, updateSightingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sightingsService.remove(+id);
  }
}
