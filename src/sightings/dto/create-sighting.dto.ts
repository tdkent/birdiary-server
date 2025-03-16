import {
  IsDate,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  MaxDate,
  MaxLength,
  MinDate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from './create-location.dto';
import birdNames from 'db/birds';

export class CreateSightingDto {
  @IsIn(birdNames, {
    message: 'Not a valid bird',
  })
  readonly commName: string;

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
