import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import CurrentUser from '../common/decorators';
import AuthGuard from '../common/guard/auth.guard';
import { LocationService } from '../locations/locations.service';
import {
  CreateSightingDto,
  GetSightingsDto,
  SightingIdDto,
  UpdateSightingDto,
} from '../sightings/dto/sighting.dto';
import { SightingsService } from './sightings.service';

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
  @Patch(':id')
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
