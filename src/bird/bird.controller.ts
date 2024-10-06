import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BirdService } from './bird.service';

@Controller('bird')
export class BirdController {
  constructor(private readonly birdService: BirdService) {}

  @Get()
  findAll() {
    return this.birdService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.birdService.findOne(id);
  }
}
