import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { BirdModule } from './bird/bird.module';
import { BirdController } from './bird/bird.controller';
import { BirdService } from './bird/bird.service';
import { LocationsModule } from './locations/locations.module';
import { LocationsController } from './locations/locations.controller';
import { LocationService } from './locations/locations.service';
import { SightingsModule } from './sightings/sightings.module';
import { SightingsController } from './sightings/sightings.controller';
import { SightingsService } from './sightings/sightings.service';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    BirdModule,
    SightingsModule,
    LocationsModule,
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
