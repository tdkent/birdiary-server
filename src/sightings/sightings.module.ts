import { Module } from '@nestjs/common';
import { BirdService } from '../bird/bird.service';
import { DatabaseService } from '../database/database.service';
import { LocationService } from '../locations/locations.service';
import { SightingsController } from './sightings.controller';
import { SightingsService } from './sightings.service';

@Module({
  controllers: [SightingsController],
  providers: [SightingsService, DatabaseService, LocationService, BirdService],
})
export class SightingsModule {}
