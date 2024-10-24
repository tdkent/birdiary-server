import { IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BIRD_COUNT } from '../../common/constants/bird.constants';

export class GetSightingsByBirdDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(BIRD_COUNT)
  readonly id: number;
}
