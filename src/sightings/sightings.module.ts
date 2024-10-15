import { Module } from '@nestjs/common';
import { SightingsService } from './sightings.service';
import { DatabaseService } from 'src/database/database.service';
import { LocationService } from './location.service';
import { SightingsController } from './sightings.controller';

@Module({
  controllers: [SightingsController],
  providers: [SightingsService, DatabaseService, LocationService],
})
export class SightingsModule {}
