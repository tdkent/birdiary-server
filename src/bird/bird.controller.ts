import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BirdService } from './bird.service';

@Controller('bird')
export class BirdController {
  constructor(private readonly birdService: BirdService) {}

  //---- GET '/bird' :: FETCH ALL BIRDS
  @Get()
  findAll() {
    return this.birdService.findAll();
  }

  //---- GET '/bird/:id' :: FETCH A SINGLE BIRD
  //! Delete this route?
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.birdService.findOne(id);
  }
}
