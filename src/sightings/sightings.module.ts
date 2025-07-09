import { Module } from '@nestjs/common';
import { SightingsService } from './sightings.service';
import { DatabaseService } from '../database/database.service';
import { LocationService } from '../locations/locations.service';
import { BirdService } from '../bird/bird.service';
import { SightingsController } from './sightings.controller';

@Module({
  controllers: [SightingsController],
  providers: [SightingsService, DatabaseService, LocationService, BirdService],
})
export class SightingsModule {}
