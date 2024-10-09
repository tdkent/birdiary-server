import { Module } from '@nestjs/common';
import { SightingsService } from './sightings.service';
import { SightingsController } from './sightings.controller';

@Module({
  controllers: [SightingsController],
  providers: [SightingsService],
})
export class SightingsModule {}
