import { Module } from '@nestjs/common';
import { SightingsService } from './sightings.service';
import { DatabaseService } from 'src/database/database.service';
import { LifeListService } from './lifelist.service';
import { SightingsController } from './sightings.controller';

@Module({
  controllers: [SightingsController],
  providers: [SightingsService, LifeListService, DatabaseService],
})
export class SightingsModule {}
