import { IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BIRD_COUNT } from '../../common/constants/api.constants';

export class UpdateFavoriteBirdDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(BIRD_COUNT)
  readonly id: number;
}
