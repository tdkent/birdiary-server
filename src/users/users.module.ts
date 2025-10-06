import { Module } from '@nestjs/common';
import { BirdService } from '../bird/bird.service';
import { DatabaseModule } from '../database/database.module';
import { LocationService } from '../locations/locations.service';
import { SightingsService } from '../sightings/sightings.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [BirdService, LocationService, SightingsService, UsersService],
})
export class UsersModule {}
