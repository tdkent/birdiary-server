import { Module } from '@nestjs/common';
import { LocationsController } from 'src/locations/locations.controller';
import { DatabaseService } from 'src/database/database.service';
import { LocationService } from 'src/locations/locations.service';

@Module({
  controllers: [LocationsController],
  providers: [DatabaseService, LocationService],
})
export class LocationsModule {}
