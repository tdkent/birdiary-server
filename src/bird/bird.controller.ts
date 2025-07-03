import {
  Controller,
  Get,
  Param,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { BirdService } from './bird.service';
import { GetSightingsByBirdDto } from '../sightings/dto/get-sighting-by-bird.dto';
import { GetBirdsByAlphaDto } from 'src/bird/dto/get-birds-by-alpha.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('birds')
export class BirdController {
  constructor(private readonly birdService: BirdService) {}

  /** GET /birds - Get all birds */
  @UseGuards(AuthGuard)
  @Get()
  getBirds(
    @CurrentUser('id') id: string,
    @Query(new ValidationPipe()) query: GetBirdsByAlphaDto,
  ) {
    return this.birdService.findAllByAlpha(id, query);
  }

  /** GET '/birds/:id' - Get bird */
  @Get(':id')
  getBird(@Param(new ValidationPipe()) params: GetSightingsByBirdDto) {
    return this.birdService.findOneWithImage(params.commName);
  }
}
