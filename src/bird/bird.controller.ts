import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { BirdService } from './bird.service';
import { GetSightingsByBirdDto } from '../sightings/dto/get-sighting-by-bird.dto';
import { GetBirdsByAlphaDto } from 'src/bird/dto/get-birds-by-alpha.dto';

@Controller('birds')
export class BirdController {
  constructor(private readonly birdService: BirdService) {}

  //---- GET '/birds?startsWith=:A-Z' :: FETCH BIRDS BY ALPHA CHAR
  @Get()
  findAllByAlpha(@Query(new ValidationPipe()) query: GetBirdsByAlphaDto) {
    return this.birdService.findAllByAlpha(query);
  }

  //---- GET '/birds/:commName' :: FETCH A SINGLE BIRD
  @Get(':commName')
  findOne(@Param(new ValidationPipe()) params: GetSightingsByBirdDto) {
    return this.birdService.findOneWithImage(params.commName);
  }
}
