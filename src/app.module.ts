import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { BirdModule } from './bird/bird.module';
import { BirdController } from './bird/bird.controller';
import { BirdService } from './bird/bird.service';
import { SightingsModule } from './sightings/sightings.module';
import { LocationService } from 'src/locations/locations.service';

@Module({
  imports: [UsersModule, DatabaseModule, BirdModule, SightingsModule],
  controllers: [UsersController, BirdController],
  providers: [UsersService, BirdService, LocationService],
})
export class AppModule {}
