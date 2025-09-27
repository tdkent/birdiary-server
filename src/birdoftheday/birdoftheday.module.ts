import { Module } from '@nestjs/common';
import { BirdService } from '../bird/bird.service';
import { DatabaseService } from '../database/database.service';
import { BirdOfTheDayController } from './birdoftheday.controller';
import { BirdOfTheDayService } from './birdoftheday.service';

@Module({
  controllers: [BirdOfTheDayController],
  providers: [BirdOfTheDayService, BirdService, DatabaseService],
})
export class BirdOfTheDayModule {}
