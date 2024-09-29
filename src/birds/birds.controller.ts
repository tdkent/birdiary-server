import { Controller, Get } from '@nestjs/common';

@Controller('birds')
export class BirdsController {
  @Get() // GET /birds
  findAll(): string {
    return 'Blue Jay';
  }
}
