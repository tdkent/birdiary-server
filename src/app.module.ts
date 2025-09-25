import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BirdController } from './bird/bird.controller';
import { BirdModule } from './bird/bird.module';
import { BirdService } from './bird/bird.service';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { LocationsController } from './locations/locations.controller';
import { LocationsModule } from './locations/locations.module';
import { LocationService } from './locations/locations.service';
import { SightingsController } from './sightings/sightings.controller';
import { SightingsModule } from './sightings/sightings.module';
import { SightingsService } from './sightings/sightings.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    BirdModule,
    SightingsModule,
    LocationsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [
    UsersController,
    BirdController,
    LocationsController,
    SightingsController,
  ],
  providers: [
    UsersService,
    BirdService,
    LocationService,
    SightingsService,
    DatabaseService,
  ],
})
export class AppModule {}
