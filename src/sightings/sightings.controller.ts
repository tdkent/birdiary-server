import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SightingsService } from './sightings.service';
import { LocationService } from '../locations/locations.service';
import {
  CreateSightingDto,
  GetSightingsDto,
  UpdateSightingDto,
  SightingIdDto,
} from '../sightings/dto/sighting.dto';
import AuthGuard from '../common/guard/auth.guard';
import CurrentUser from '../common/decorators';

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
    @Body(ValidationPipe) reqBody: CreateSightingDto,
  ) {
    return this.sightingsService.createSighting(userId, reqBody);
  }

  /** GET '/sightings' - Get user's sightings */
  @Get()
  getSightings(
    @CurrentUser('id') userId: number,
    @Query(new ValidationPipe()) reqQuery: GetSightingsDto,
  ) {
    return this.sightingsService.getSightings(userId, reqQuery);
  }

  /** GET '/sightings/:id' - Get sighting */
  @Get(':id')
  getSighting(
    @CurrentUser('id') userId: number,
    @Param(new ValidationPipe()) params: SightingIdDto,
  ) {
    return this.sightingsService.getSighting(userId, params.id);
  }

  /** PUT '/sightings/:id' - Update sighting */
  @Put(':id')
  updateSighting(
    @CurrentUser('id') userId: number,
    @Param(new ValidationPipe()) params: SightingIdDto,
    @Body() reqBody: UpdateSightingDto,
  ) {
    return this.sightingsService.updateSighting(userId, params.id, reqBody);
  }

  /** DELETE '/sightings/:id' - Delete sighting */
  @Delete(':id')
  deleteSighting(
    @CurrentUser('id') userId: number,
    @Param(new ValidationPipe()) params: SightingIdDto,
  ) {
    return this.sightingsService.deleteSighting(userId, params.id);
  }
}
