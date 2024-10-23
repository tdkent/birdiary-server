import { Controller, Get, Param, ValidationPipe } from '@nestjs/common';
import { BirdService } from './bird.service';
import { GetSightingsByBirdDto } from 'src/sightings/dto/get-sighting-by-bird.dto';

@Controller('bird')
export class BirdController {
  constructor(private readonly birdService: BirdService) {}

  //---- GET '/bird' :: FETCH ALL BIRDS
  @Get()
  findAll() {
    return this.birdService.findAll();
  }

  //---- GET '/bird/:id' :: FETCH A SINGLE BIRD
  @Get(':id')
  findOne(@Param(new ValidationPipe()) params: GetSightingsByBirdDto) {
    return this.birdService.findOne(params.id);
  }
}
