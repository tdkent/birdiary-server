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
import { LocationService } from './location.service';
import { CreateSightingDto } from './dto/create-sighting.dto';
import { LocationDto } from './dto/create-location.dto';
import { UpdateSightingDto } from './dto/update-sighting.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(AuthGuard)
@Controller('sightings')
export class SightingsController {
  constructor(
    private readonly sightingsService: SightingsService,
    private readonly locationsService: LocationService,
  ) {}

  //---- POST '/sightings' :: Create a new bird sighting
  @Post()
  create(
    @CurrentUser('id') id: number,
    @Body(ValidationPipe) createSightingDto: CreateSightingDto,
  ) {
    return this.sightingsService.create(id, createSightingDto);
  }

  //---- GET '/sightings' :: Fetch all user's sightings
  @Get()
  findAll(@CurrentUser('id') id: number) {
    return this.sightingsService.findAll(id);
  }

  //---- GET '/sightings/lifelist' :: Fetch user's lifelist
  @Get('lifelist')
  findLifeList(@CurrentUser('id') id: number) {
    return this.sightingsService.findLifeList(id);
  }

  //---- GET '/sightings/locations' :: Fetch all user's locations with sighting count
  @Get('locations')
  groupAllLocations(@CurrentUser('id') id: number) {
    return this.sightingsService.groupAllLocations(id);
  }

  //---- GET '/sightings/locations/:id' :: Fetch all user's sightings by location
  @Get('locations/:id')
  findAllByLocation(
    @CurrentUser('id') id: number,
    @Param('id', ParseIntPipe) locationId: number,
  ) {
    return this.sightingsService.findSightingsBySingleLocation(id, locationId);
  }

  //---- PATCH 'sightings/locations/:id' :: Update a single location
  @Patch('locations/:id')
  updateLocation(
    @CurrentUser('id') id: number,
    @Param('id', ParseIntPipe) locationId: number,
    @Body(ValidationPipe) locationDto: LocationDto,
  ) {
    return this.locationsService.updateLocation(id, locationId, locationDto);
  }

  //---- DELETE 'sightings/locations/:id' :: Remove a single location
  @Delete('locations/:id')
  deleteLocation(
    @CurrentUser('id') id: number,
    @Param('id', ParseIntPipe) locationId: number,
  ) {
    return this.locationsService.removeLocation(id, locationId);
  }

  //---- GET '/sightings/:id' :: Fetch a single sighting
  //! Remove this route?
  @Get(':id')
  findOne(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) sightingId: number,
  ) {
    return this.sightingsService.findOne(userId, sightingId);
  }

  //---- PATCH 'sightings/:id' :: Update a single sighting
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
  remove(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) sightingId: number,
  ) {
    return this.sightingsService.remove(userId, sightingId);
  }
}
