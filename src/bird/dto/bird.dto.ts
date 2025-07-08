import { IsInt, IsOptional, Length, Matches, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ErrorMessages } from 'src/common/models';
import { BIRD_COUNT } from 'src/common/constants';

export class BirdIdDto {
  @Type(() => Number) // cast id type to use in params DTO
  @IsInt({ message: ErrorMessages.BadRequest })
  @Min(1, { message: ErrorMessages.BadRequest })
  @Max(BIRD_COUNT, { message: ErrorMessages.BadRequest })
  readonly id: number;
}

export class GetBirdsDto {
  @IsOptional()
  @Length(1, 1, { message: ErrorMessages.BadRequest })
  @Matches(/[A-Z]/, { message: ErrorMessages.BadRequest })
  readonly startsWith: string;

  @Type(() => Number)
  @IsInt({ message: ErrorMessages.BadRequest })
  @Min(1, { message: ErrorMessages.BadRequest })
  @Max(34, { message: ErrorMessages.BadRequest })
  readonly page: number;
}
