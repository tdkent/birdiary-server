import { Module } from '@nestjs/common';
import { SightingsService } from './sightings.service';
import { DatabaseService } from 'src/database/database.service';
import { SightingsController } from './sightings.controller';

@Module({
  controllers: [SightingsController],
  providers: [SightingsService, DatabaseService],
})
export class SightingsModule {}
