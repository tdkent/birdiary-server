import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthService } from './users/auth.service';
import { BirdModule } from './bird/bird.module';
import { BirdController } from './bird/bird.controller';
import { BirdService } from './bird/bird.service';
import { ProfileService } from './users/profile.service';
import { SightingsModule } from './sightings/sightings.module';
import { LocationService } from './sightings/location.service';

@Module({
  imports: [UsersModule, DatabaseModule, BirdModule, SightingsModule],
  controllers: [AppController, UsersController, BirdController],
  providers: [
    AppService,
    UsersService,
    AuthService,
    BirdService,
    ProfileService,
    LocationService,
  ],
})
export class AppModule {}
