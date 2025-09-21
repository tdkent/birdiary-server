import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import CurrentUser from '../common/decorators';
import AuthGuard from '../common/guard/auth.guard';
import { BirdService } from './bird.service';
import { BirdIdDto, GetBirdsDto } from './dto/bird.dto';

@Controller('birds')
export class BirdController {
  constructor(private readonly birdService: BirdService) {}

  /** GET /birds - Get all birds */
  @UseGuards(AuthGuard)
  @Get()
  getBirds(
    @CurrentUser('id') id: number,
    @Query(new ValidationPipe()) query: GetBirdsDto,
  ) {
    return this.birdService.getBirds(id, query);
  }

  /** GET '/birds/:id' - Get single bird w/image */
  @Get(':id')
  getBird(@Param(new ValidationPipe()) params: BirdIdDto) {
    return this.birdService.getBird(params.id);
  }
}
