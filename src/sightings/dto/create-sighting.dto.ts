import {
  IsDate,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxDate,
  MaxLength,
  Min,
  MinDate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BIRD_COUNT } from 'src/common/constants/bird.constants';
import { LocationDto } from './create-location.dto';

export class CreateSightingDto {
  @IsInt()
  @Min(1)
  @Max(BIRD_COUNT)
  readonly bird_id: number;

  @IsDate()
  @Type(() => Date)
  @MinDate(new Date('1950-01-01'))
  @MaxDate(new Date())
  readonly date: Date;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  readonly desc: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
