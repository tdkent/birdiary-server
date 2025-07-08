import { IsInt, IsNumber, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType, PickType } from '@nestjs/swagger';

export class LocationDto {
  @Type(() => Number) // cast id type to use in params DTO
  @IsInt({ message: 'Invalid request.' })
  @Min(1, { message: 'Invalid request.' })
  readonly id: number;

  @IsString({ message: 'Invalid request.' })
  readonly name: string;

  @IsNumber({}, { message: 'Invalid request.' })
  @Min(-90, { message: 'Invalid request.' })
  @Max(90, { message: 'Invalid request.' })
  readonly lat: number;

  @IsNumber({}, { message: 'Invalid request.' })
  @Min(-180, { message: 'Invalid request.' })
  @Max(180, { message: 'Invalid request.' })
  readonly lng: number;
}

export class LocationIdDto extends PickType(LocationDto, ['id'] as const) {}
export class UpsertLocationDto extends OmitType(LocationDto, ['id'] as const) {}
