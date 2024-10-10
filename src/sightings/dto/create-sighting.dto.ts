import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { BIRD_COUNT } from 'src/common/constants/bird.constants';
export class CreateSightingDto {
  @IsInt()
  @Min(1)
  @Max(BIRD_COUNT)
  readonly bird_id: number;

  @IsDateString()
  readonly date: Date;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  readonly desc: string;
}
