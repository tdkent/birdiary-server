import { IsInt, IsOptional, Length, Matches, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { BIRD_COUNT } from 'src/common/constants';

export class BirdIdDto {
  @Type(() => Number)
  @IsInt({ message: 'Invalid request.' })
  @Min(1, { message: 'Invalid request.' })
  @Max(BIRD_COUNT, { message: 'Invalid request.' })
  readonly id: number;
}

export class GetBirdsDto {
  @IsOptional()
  @Length(1, 1, { message: 'Invalid request.' })
  @Matches(/[A-Z]/, { message: 'Invalid request.' })
  readonly startsWith: string;

  @Type(() => Number)
  @IsInt({ message: 'Invalid request.' })
  @Min(1, { message: 'Invalid request.' })
  @Max(34, { message: 'Invalid request.' })
  readonly page: number;
}
