import { IsNumber, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetRecentSightingsDto {
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(3)
  readonly page: number;
}
