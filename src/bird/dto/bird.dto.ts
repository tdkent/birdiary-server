import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { BIRD_COUNT } from '../../common/constants';
import { ErrorMessages } from '../../common/models';

export class BirdIdDto {
  @Type(() => Number) // cast id type to use in params DTO
  @IsInt({ message: ErrorMessages.BadRequest })
  @Min(1, { message: ErrorMessages.BadRequest })
  @Max(BIRD_COUNT, { message: ErrorMessages.BadRequest })
  readonly id: number;
}

export class GetBirdsDto {
  @IsOptional()
  @MinLength(3, { message: ErrorMessages.BadRequest })
  @MaxLength(32, { message: ErrorMessages.BadRequest })
  @Transform((value) => {
    const searchString = value.value as string;
    const regex = /[^A-Za-z ]/g;
    return searchString.toLowerCase().replaceAll(regex, ' ');
  })
  readonly search: string;

  @IsOptional()
  @Length(1, 1, { message: ErrorMessages.BadRequest })
  @Matches(/[A-Z]/, { message: ErrorMessages.BadRequest })
  readonly startsWith: string;

  @Type(() => Number)
  @IsInt({ message: ErrorMessages.BadRequest })
  @Min(1, { message: ErrorMessages.BadRequest })
  readonly page: number;
}

export class GetSightingsByBirdIdDto {
  @IsIn(['dateAsc', 'dateDesc'], {
    message: ErrorMessages.BadRequest,
  })
  readonly sortBy: string;

  @Type(() => Number)
  @IsInt({ message: ErrorMessages.BadRequest })
  @Min(1, { message: ErrorMessages.BadRequest })
  readonly page: number;
}
