import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { LocationService } from './locations.service';
import { LocationDto } from './dto/location.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(AuthGuard)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationService) {}

  /** GET 'locations/:id' - Get location */
  @Get(':id')
  getLocation(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.findOne(id);
  }

  /** PUT 'locations/:id' - Update location */
  @Put(':id')
  updateLocation(
    @CurrentUser('id') id: string,
    @Param('id', ParseIntPipe) locationId: number,
    @Body(ValidationPipe) locationDto: LocationDto,
  ) {
    return this.locationsService.update(id, locationId, locationDto);
  }

  /** DELETE 'locations/:id' - Delete location */
  @Delete(':id')
  deleteLocation(
    @CurrentUser('id') id: string,
    @Param('id', ParseIntPipe) locationId: number,
  ) {
    return this.locationsService.remove(id, locationId);
  }
}
