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
import { GetSightingsByBirdDto } from './dto/get-sighting-by-bird.dto';
import { GetSightingByDateQueryDto } from 'src/sightings/dto/get-sighting-by-date-query.dto';
import { GetSightingByBirdQueryDto } from 'src/sightings/dto/get-sightings-by-bird-query.dto';
// import { GetRecentSightingsDto } from './dto/get-recent-sightings.dto';
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
    @CurrentUser('id') id: string,
    @Body(ValidationPipe) createSightingDto: CreateSightingDto,
  ) {
    return this.sightingsService.create(id, createSightingDto);
  }

  //---- GET '/sightings' :: Find user's recent sightings
  //---- GET '/sightings?groupBy=date' :: Group user's sightings by date
  //---- GET '/sightings?groupBy=bird' :: Group user's sightings by bird
  //---- GET '/sightings?groupBy=location' :: Group user's sightings by location
  //---- GET '/sightings?groupyBy=lifelist :: Get user's life list
  @Get()
  findAllOrGroup(
    @CurrentUser('id') id: string,
    @Query(new ValidationPipe()) query: GroupSightingDto,
  ) {
    return this.sightingsService.findAllOrGroup(id, query);
  }

  //---- GET '/sightings/recent/:page' :: Find paginated recent sightings
  //? Uses offset pagination, receives :page param to calculate records to skip
  // @Get('/recent/:page')
  @Get('/recent')
  findRecent(
    @CurrentUser('id') id: string,
    // @Param(new ValidationPipe()) params: GetRecentSightingsDto,
  ) {
    // return this.sightingsService.findRecent(id, params);
    return this.sightingsService.findRecent(id);
  }

  //---- GET '/sightings/date/:date' :: Find all user's sightings by single date
  @Get('date/:date')
  findAllByDate(
    @CurrentUser('id') id: string,
    @Param() params: GetSightingByDateDto,
    @Query(new ValidationPipe()) query: GetSightingByDateQueryDto,
  ) {
    return this.sightingsService.findSightingsBySingleDate(
      id,
      params.date,
      query,
    );
  }

  //---- GET '/sightings/bird/:commName' :: Find all user's sightings by single bird
  @Get('bird/:commName')
  findAllByBird(
    @CurrentUser('id') id: string,
    @Param(new ValidationPipe()) params: GetSightingsByBirdDto,
    @Query(new ValidationPipe()) query: GetSightingByBirdQueryDto,
  ) {
    return this.sightingsService.findSightingsBySingleBird(
      id,
      params.commName,
      query,
    );
  }

  //---- GET 'sightings/locations/:id' :: Find a single location
  @Get('locations/:id')
  findSingleLocation(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.findOne(id);
  }

  //---- GET '/sightings/locations/:id/all' :: Find all user's sightings by single location
  @Get('locations/:id/all')
  findAllByLocation(
    @CurrentUser('id') id: string,
    @Param('id', ParseIntPipe) locationId: number,
  ) {
    return this.sightingsService.findSightingsBySingleLocation(id, locationId);
  }

  //---- GET 'sightings/locations/:id/group :: Group user's birds by single location
  @Get('locations/:id/group')
  groupBirdsByLocation(
    @CurrentUser('id') id: string,
    @Param('id', ParseIntPipe) locationId: number,
  ) {
    return this.sightingsService.groupBirdsByLocation(id, locationId);
  }

  //---- PATCH 'sightings/locations/:id' :: Update a single location
  @Patch('locations/:id')
  updateLocation(
    @CurrentUser('id') id: string,
    @Param('id', ParseIntPipe) locationId: number,
    @Body(ValidationPipe) locationDto: LocationDto,
  ) {
    return this.locationsService.update(id, locationId, locationDto);
  }

  //---- GET '/sightings/:id' :: Find a single sighting
  //! Remove this route?
  @Get(':id')
  findOne(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) sightingId: number,
  ) {
    return this.sightingsService.findOne(userId, sightingId);
  }

  //---- PATCH 'sightings/:id' :: Update a single sighting
  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) sightingId: number,
    @Body() updateSightingDto: UpdateSightingDto,
  ) {
    return this.sightingsService.update(userId, sightingId, updateSightingDto);
  }

  //---- DELETE 'sightings/:id' :: Delete a single sighting
  @Delete(':id')
  remove(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) sightingId: number,
  ) {
    return this.sightingsService.remove(userId, sightingId);
  }
}
