import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { LocationService } from './locations.service';
import { UpsertLocationDto, LocationIdDto } from './dto/location.dto';
import AuthGuard from '../common/guard/auth.guard';
import CurrentUser from '../common/decorators';

@UseGuards(AuthGuard)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationService) {}

  /** GET 'locations/:id' - Get location */
  @Get(':id')
  getLocation(
    @CurrentUser('id') userId: number,
    @Param(new ValidationPipe()) params: LocationIdDto,
  ) {
    return this.locationsService.getLocation(userId, params.id);
  }

  /** PUT 'locations/:id' - Update location */
  @Put(':id')
  updateLocation(
    @CurrentUser('id') userId: number,
    @Param(new ValidationPipe()) params: LocationIdDto,
    @Body(ValidationPipe) reqBody: UpsertLocationDto,
  ) {
    return this.locationsService.updateLocation(userId, params.id, reqBody);
  }

  /** DELETE 'locations/:id' - Delete location */
  @Delete(':id')
  deleteLocation(
    @CurrentUser('id') userId: number,
    @Param(new ValidationPipe()) params: LocationIdDto,
  ) {
    return this.locationsService.deleteLocation(userId, params.id);
  }
}
