import { Controller, Get, Param, ValidationPipe } from '@nestjs/common';
import { BirdService } from './bird.service';
import { GetSightingsByBirdDto } from '../sightings/dto/get-sighting-by-bird.dto';

@Controller('birds')
export class BirdController {
  constructor(private readonly birdService: BirdService) {}

  //---- GET '/birds' :: FETCH ALL BIRDS
  @Get()
  findAll() {
    return this.birdService.findAll();
  }

  //---- GET '/birds/:id' :: FETCH A SINGLE BIRD
  @Get(':id')
  findOne(@Param(new ValidationPipe()) params: GetSightingsByBirdDto) {
    return this.birdService.findOneWithImage(params.id);
  }
}
