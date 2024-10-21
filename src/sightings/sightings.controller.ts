import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SightingsService } from './sightings.service';
import { LocationService } from './location.service';
import { CreateSightingDto } from './dto/create-sighting.dto';
import { LocationDto } from './dto/create-location.dto';
import { UpdateSightingDto } from './dto/update-sighting.dto';
import { GroupSightingDto } from './dto/group-sighting.dto';
import { GetSightingByDateDto } from './dto/get-sighting-by-date.dto';
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

  //---- GET '/sightings' :: Find all user's sightings
  //---- GET '/sightings?groupby=date' :: Group user's sightings by date
  //---- GET '/sightings?groupby=bird_id' :: Group user's sightings by bird
  //---- GET '/sightings?groupby=location_id' :: Group user's sightings by location
  @Get()
  findAllOrGroup(
    @CurrentUser('id') id: number,
    @Query(new ValidationPipe()) query: GroupSightingDto,
  ) {
    return this.sightingsService.findAllOrGroup(id, query);
  }

  //---- GET '/sightings/lifelist' :: Find user's lifelist
  @Get('lifelist')
  findLifeList(@CurrentUser('id') id: number) {
    return this.sightingsService.findLifeList(id);
  }

  //---- GET '/sightings/date/:date' :: Find all user's sightings by single date
  @Get('date/:date')
  findAllByDate(
    @CurrentUser('id') id: number,
    @Param() params: GetSightingByDateDto,
  ) {
    return this.sightingsService.findSightingsBySingleDate(id, params);
  }

  //---- GET '/sightings/date/:date' :: Find all user's sightings by single bird
  @Get('bird/:id')
  findAllByBird(
    @CurrentUser('id') id: number,
    @Param('id', ParseIntPipe) birdId: number,
  ) {
    return this.sightingsService.findSightingsBySingleBird(id, birdId);
  }

  //---- GET '/sightings/locations/:id' :: Find all user's sightings by single location
  @Get('locations/:id')
  findAllByLocation(
    @CurrentUser('id') id: number,
    @Param('id', ParseIntPipe) locationId: number,
  ) {
    return this.sightingsService.findSightingsBySingleLocation(id, locationId);
  }

  //---- PATCH 'sightings/locations/:id' :: Upsert location, update Sighting
  @Patch('locations/:id')
  updateLocation(
    @CurrentUser('id') id: number,
    @Param('id', ParseIntPipe) locationId: number,
    @Body(ValidationPipe) locationDto: LocationDto,
  ) {
    return this.locationsService.update(id, locationId, locationDto);
  }

  //---- GET '/sightings/:id' :: Find a single sighting
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
