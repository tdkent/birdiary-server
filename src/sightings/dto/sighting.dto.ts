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
import { BIRD_COUNT } from 'src/common/constants';

class SightingDto {
  @Type(() => Number) // cast id type to use in params DTO
  @IsInt({ message: 'Invalid request.' })
  @Min(1, { message: 'Invalid request.' })
  readonly id: number;

  @IsInt({ message: 'Invalid request.' })
  @Min(1, { message: 'Invalid request.' })
  readonly userId: number;

  @IsInt({ message: 'Invalid request.' })
  @Min(1, { message: 'Invalid request.' })
  @Max(BIRD_COUNT, { message: 'Invalid request.' })
  readonly birdId: number;

  @ValidateIf((_, value) => value !== null)
  @IsInt({ message: 'Invalid request.' })
  readonly locationId: number;

  @Type(() => Date)
  @IsDate({ message: 'Invalid request.' })
  @MinDate(new Date('1950-01-01'), { message: 'Invalid request.' })
  @MaxDate(() => new Date(), { message: 'Invalid request.' })
  readonly date: Date;

  @IsString({ message: 'Invalid request.' })
  @MaxLength(150, { message: 'Invalid request.' })
  @ValidateIf((_, value) => value !== null)
  readonly description: string;
}

export class CreateSightingDto extends PickType(SightingDto, [
  'birdId',
  'date',
  'description',
] as const) {
  @IsOptional()
  @IsObject({ message: 'Invalid request.' })
  @ValidateNested({ message: 'Invalid request.' })
  @Type(() => LocationDto)
  location: LocationDto;
}

export class GetSightingsDto {
  @IsOptional()
  @IsIn(['date', 'location', 'lifelist'], { message: 'Invalid request.' })
  readonly groupBy?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Invalid request.' })
  @Min(1, { message: 'Invalid request.' })
  @Max(BIRD_COUNT, { message: 'Invalid request.' })
  readonly birdId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Invalid request.' })
  @Min(1, { message: 'Invalid request.' })
  readonly locationId?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Invalid request.' })
  @MinDate(new Date('1950-01-01'), { message: 'Invalid request.' })
  @MaxDate(() => new Date(), { message: 'Invalid request.' })
  readonly dateId?: Date;

  @IsOptional()
  @IsIn(['alphaAsc', 'alphaDesc', 'count', 'dateAsc', 'dateDesc'], {
    message: 'Invalid request.',
  })
  readonly sortBy?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Invalid request.' })
  @Min(1, { message: 'Invalid request.' })
  readonly page?: number;
}

export class UpdateSightingDto extends CreateSightingDto {}
