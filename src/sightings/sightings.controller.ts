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
import { CreateSightingDto } from './dto/create-sighting.dto';
import { GetSightingsDto } from './dto/get-sightings.dto';
import { UpdateSightingDto } from './dto/update-sighting.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LifeListService } from './lifelist.service';

@UseGuards(AuthGuard)
@Controller('sightings')
export class SightingsController {
  constructor(
    private readonly sightingsService: SightingsService,
    private readonly lifeListService: LifeListService,
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
  //---- GET '/sightings?get=locations' :: Fetch count of sightings for each location
  //---- GET '/sightings?get=lifelist' :: Fetch user's lifelist
  @Get()
  findAll(
    @CurrentUser('id') id: number,
    @Query(new ValidationPipe()) get?: GetSightingsDto,
  ) {
    return this.sightingsService.findAll(id, get);
  }

  //---- GET '/sightings?get=locations' :: Fetch user's life list
  @Get('')
  findAllLocations() {
    return this.sightingsService.findAllLocations();
  }

  //---- GET '/sightings?get=lifelist' :: Fetch user's life list
  @Get(':id/lifelist')
  findLifeList(@CurrentUser('id') id: number) {
    return this.lifeListService.findLifeList(id);
  }

  //---- GET '/sightings/:id' :: Fetch a single sighting
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
