import { PickType } from '@nestjs/swagger';
import {
  IsDate,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxDate,
  MaxLength,
  Min,
  Max,
  MinDate,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from '../../locations/dto/location.dto';
import { BIRD_COUNT } from 'src/common/constants/api.constants';

class SightingDto {
  @Type(() => Number)
  @IsInt()
  readonly id: number;

  @Type(() => Number)
  @IsInt()
  readonly userId: number;

  @IsInt()
  @Min(1)
  @Max(BIRD_COUNT)
  readonly birdId: number;

  @ValidateIf((_, value) => value !== null)
  @IsInt()
  readonly locationId: number;

  @IsDate()
  @Type(() => Date)
  @MinDate(new Date('1950-01-01'))
  @MaxDate(() => new Date())
  readonly date: Date;

  @IsString()
  @MaxLength(150)
  @ValidateIf((_, value) => value !== null)
  readonly description: string;
}

export class CreateSightingDto extends PickType(SightingDto, [
  'birdId',
  'date',
  'description',
] as const) {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}

// GET /sightings?birdId=123
// GET /sightings?locationId=456
// GET /sightings?date=2025-07-01
export class GetSightingsDto {
  @IsOptional()
  @IsIn(['date', 'location', 'lifelist'], { message: 'Invalid query' })
  readonly groupBy?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Invalid query' })
  @Min(1, { message: 'Invalid query' })
  @Max(BIRD_COUNT)
  readonly birdId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Invalid query' })
  @Min(1, { message: 'Invalid query' })
  readonly locationId?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @MinDate(new Date('1950-01-01'))
  @MaxDate(() => new Date())
  readonly dateId?: Date;

  @IsOptional()
  @IsIn(['alphaAsc', 'alphaDesc', 'count', 'dateAsc', 'dateDesc'], {
    message: 'Invalid query',
  })
  readonly sortBy?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Invalid query' })
  @Min(1, { message: 'Invalid query' })
  readonly page?: number;
}

export class UpdateSightingDto extends CreateSightingDto {}
