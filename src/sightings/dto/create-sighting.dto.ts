import {
  IsDateString,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BIRD_COUNT } from 'src/common/constants/bird.constants';

export class LocationDto {
  @IsString()
  @MaxLength(150)
  readonly name: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  readonly lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  readonly lng: number;
}

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

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  loc: LocationDto;
}
