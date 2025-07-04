import { IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { BIRD_COUNT } from 'src/common/constants/api.constants';

export default class GetBirdDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(BIRD_COUNT)
  readonly id: number;
}
