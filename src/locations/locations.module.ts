import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller';
import { DatabaseService } from '../database/database.service';
import { LocationService } from './locations.service';

@Module({
  controllers: [LocationsController],
  providers: [DatabaseService, LocationService],
})
export class LocationsModule {}
