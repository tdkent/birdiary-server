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
import { ErrorMessages } from '../../common/models';
import { CreateLocationDto } from '../../locations/dto/location.dto';
import { BIRD_COUNT } from '../../common/constants';

class SightingDto {
  @Type(() => Number) // cast id type to use in params DTO
  @IsInt({ message: ErrorMessages.BadRequest })
  @Min(1, { message: ErrorMessages.BadRequest })
  readonly id: number;

  @IsInt({ message: ErrorMessages.BadRequest })
  @Min(1, { message: ErrorMessages.BadRequest })
  readonly userId: number;

  @IsInt({ message: ErrorMessages.BadRequest })
  @Min(1, { message: ErrorMessages.BadRequest })
  @Max(BIRD_COUNT, { message: ErrorMessages.BadRequest })
  readonly birdId: number;

  @ValidateIf((_, value) => value !== null)
  @IsInt({ message: ErrorMessages.BadRequest })
  readonly locationId: number;

  @Type(() => Date)
  @IsDate({ message: ErrorMessages.BadRequest })
  @MinDate(new Date('1950-01-01'), { message: ErrorMessages.BadRequest })
  @MaxDate(() => new Date(), { message: ErrorMessages.BadRequest })
  readonly date: Date;

  @IsString({ message: ErrorMessages.BadRequest })
  @MaxLength(150, { message: ErrorMessages.BadRequest })
  @ValidateIf((_, value) => value !== null)
  readonly description: string;
}

export class CreateSightingDto extends PickType(SightingDto, [
  'birdId',
  'date',
  'description',
] as const) {
  @IsOptional()
  @IsObject({ message: ErrorMessages.BadRequest })
  @ValidateNested({ message: ErrorMessages.BadRequest })
  @Type(() => CreateLocationDto)
  location: CreateLocationDto;
}

export class GetSightingsDto {
  @IsOptional()
  @IsIn(['date', 'lifelist'], { message: ErrorMessages.BadRequest })
  readonly groupBy?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: ErrorMessages.BadRequest })
  @Min(1, { message: ErrorMessages.BadRequest })
  @Max(BIRD_COUNT, { message: ErrorMessages.BadRequest })
  readonly birdId?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: ErrorMessages.BadRequest })
  @MinDate(new Date('1950-01-01'), { message: ErrorMessages.BadRequest })
  @MaxDate(() => new Date(), { message: ErrorMessages.BadRequest })
  readonly dateId?: Date;

  @IsIn(['alphaAsc', 'alphaDesc', 'count', 'dateAsc', 'dateDesc'], {
    message: ErrorMessages.BadRequest,
  })
  readonly sortBy: string;

  @Type(() => Number)
  @IsInt({ message: ErrorMessages.BadRequest })
  @Min(1, { message: ErrorMessages.BadRequest })
  readonly page: number;
}

export class SightingIdDto extends PickType(SightingDto, ['id'] as const) {}
export class UpdateSightingDto extends CreateSightingDto {}
