import {
  Controller,
  Get,
  Param,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { BirdService } from './bird.service';
import GetBirdsDto from 'src/bird/dto/getBirds.dto';
import GetBirdDto from 'src/bird/dto/getBird.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';

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
  getBird(@Param(new ValidationPipe()) params: GetBirdDto) {
    return this.birdService.getBird(params.id);
  }
}
