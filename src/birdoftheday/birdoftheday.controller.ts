import { Controller, Get } from '@nestjs/common';
import { BirdOfTheDayService } from './birdoftheday.service';

@Controller('birdoftheday')
export class BirdOfTheDayController {
  constructor(private readonly birdOfTheDayService: BirdOfTheDayService) {}

  @Get()
  findBirdOfTheDay() {
    return this.birdOfTheDayService.findBirdOfTheDay();
  }
}
