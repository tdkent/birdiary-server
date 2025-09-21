import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { LocationsController } from './locations.controller';
import { LocationService } from './locations.service';

@Module({
  controllers: [LocationsController],
  providers: [DatabaseService, LocationService],
})
export class LocationsModule {}
