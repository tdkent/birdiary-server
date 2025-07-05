import {
  IsDate,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxDate,
  MaxLength,
  Min,
  Max,
  MinDate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from '../../locations/dto/location.dto';
import { BIRD_COUNT } from 'src/common/constants/api.constants';

export class CreateSightingDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(BIRD_COUNT)
  readonly birdId: number;

  @IsDate()
  @Type(() => Date)
  @MinDate(new Date('1950-01-01'))
  @MaxDate(() => new Date())
  readonly date: Date;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  readonly description: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
