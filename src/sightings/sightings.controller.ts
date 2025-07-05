import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SightingsService } from './sightings.service';
import { LocationService } from 'src/locations/locations.service';
import { CreateSightingDto } from './dto/create-sighting.dto';
// import { LocationDto } from '../locations/dto/location.dto';
import { UpdateSightingDto } from './dto/update-sighting.dto';
import { GroupSightingDto } from './dto/group-sighting.dto';
// import { GetSightingByDateDto } from './dto/get-sighting-by-date.dto';
// import { GetSightingsByBirdDto } from './dto/get-sighting-by-bird.dto';
// import { GetSightingByDateQueryDto } from 'src/sightings/dto/get-sighting-by-date-query.dto';
// import { GetSightingByBirdQueryDto } from 'src/sightings/dto/get-sightings-by-bird-query.dto';
// import { GetSightingByLocationQueryDto } from 'src/sightings/dto/get-sightings-by-location-query.dto';
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

  /** POST '/sightings' - Create new sighting */
  @Post()
  createSighting(
    @CurrentUser('id') userId: number,
    @Body(ValidationPipe) createSightingDto: CreateSightingDto,
  ) {
    return this.sightingsService.createSighting(userId, createSightingDto);
  }

  /** GET '/sightings' - Get user's sightings */
  @Get()
  getSightings(
    @CurrentUser('id') userId: number,
    @Query(new ValidationPipe()) query: GroupSightingDto,
  ) {
    return this.sightingsService.getSightings(userId, query);
  }

  /** GET '/sightings/:id' - Get sighting */
  @Get(':id')
  getSighting(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) sightingId: number,
  ) {
    return this.sightingsService.findOne(userId, sightingId);
  }

  /** PUT '/sightings/:id' - Update sighting */
  @Put(':id')
  updateSighting(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) sightingId: number,
    @Body() updateSightingDto: UpdateSightingDto,
  ) {
    return this.sightingsService.updateSighting(
      userId,
      sightingId,
      updateSightingDto,
    );
  }

  /** DELETE '/sightings/:id' - Delete sighting */
  @Delete(':id')
  deleteSighting(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) sightingId: number,
  ) {
    return this.sightingsService.deleteSighting(userId, sightingId);
  }
}

//---- GET '/sightings/recent/:page' :: Find paginated recent sightings
//? Uses offset pagination, receives :page param to calculate records to skip
// @Get('/recent/:page')
// @Get('/recent')
// findRecent(
//   @CurrentUser('id') id: string,
//   // @Param(new ValidationPipe()) params: GetRecentSightingsDto,
// ) {
//   // return this.sightingsService.findRecent(id, params);
//   return this.sightingsService.findRecent(id);
// }

//---- GET '/sightings/date/:date' :: Find all user's sightings by single date
// @Get('date/:date')
// findAllByDate(
//   @CurrentUser('id') id: string,
//   @Param() params: GetSightingByDateDto,
//   @Query(new ValidationPipe()) query: GetSightingByDateQueryDto,
// ) {
//   return this.sightingsService.findSightingsBySingleDate(
//     id,
//     params.date,
//     query,
//   );
// }

//---- GET '/sightings/bird/:commName' :: Find all user's sightings by single bird
// @Get('bird/:commName')
// findAllByBird(
//   @CurrentUser('id') id: string,
//   @Param(new ValidationPipe()) params: GetSightingsByBirdDto,
//   @Query(new ValidationPipe()) query: GetSightingByBirdQueryDto,
// ) {
//   return this.sightingsService.findSightingsBySingleBird(
//     id,
//     params.commName,
//     query,
//   );
// }

//---- GET 'sightings/locations/:id' :: Find a single location
// @Get('locations/:id')
// findSingleLocation(@Param('id', ParseIntPipe) id: number) {
//   return this.locationsService.findOne(id);
// }

//---- GET '/sightings/locations/:id/all' :: Find all user's sightings by single location
// @Get('locations/:id/all')
// findAllByLocation(
//   @CurrentUser('id') id: string,
//   @Param('id', ParseIntPipe) locationId: number,
//   @Query(new ValidationPipe()) query: GetSightingByLocationQueryDto,
// ) {
//   return this.sightingsService.findSightingsBySingleLocation(
//     id,
//     locationId,
//     query,
//   );
// }

//---- GET 'sightings/locations/:id/group :: Group user's birds by single location
// @Get('locations/:id/group')
// groupBirdsByLocation(
//   @CurrentUser('id') id: string,
//   @Param('id', ParseIntPipe) locationId: number,
// ) {
//   return this.sightingsService.groupBirdsByLocation(id, locationId);
// }

//---- PUT 'sightings/locations/:id' :: Update a single location
// @Put('locations/:id')
// updateLocation(
//   @CurrentUser('id') id: string,
//   @Param('id', ParseIntPipe) locationId: number,
//   @Body(ValidationPipe) locationDto: LocationDto,
// ) {
//   return this.locationsService.update(id, locationId, locationDto);
// }

// @Delete('locations/:id')
// removeLocation(
//   @CurrentUser('id') id: string,
//   @Param('id', ParseIntPipe) locationId: number,
// ) {
//   return this.locationsService.remove(id, locationId);
// }
