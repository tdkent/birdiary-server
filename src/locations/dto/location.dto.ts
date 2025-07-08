import { IsInt, IsNumber, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType, PickType } from '@nestjs/swagger';
import { ErrorMessages } from 'src/common/models';

export class LocationDto {
  @Type(() => Number) // cast id type to use in params DTO
  @IsInt({ message: ErrorMessages.BadRequest })
  @Min(1, { message: ErrorMessages.BadRequest })
  readonly id: number;

  @IsString({ message: ErrorMessages.BadRequest })
  readonly name: string;

  @IsNumber({}, { message: ErrorMessages.BadRequest })
  @Min(-90, { message: ErrorMessages.BadRequest })
  @Max(90, { message: ErrorMessages.BadRequest })
  readonly lat: number;

  @IsNumber({}, { message: ErrorMessages.BadRequest })
  @Min(-180, { message: ErrorMessages.BadRequest })
  @Max(180, { message: ErrorMessages.BadRequest })
  readonly lng: number;
}

export class LocationIdDto extends PickType(LocationDto, ['id'] as const) {}
export class UpsertLocationDto extends OmitType(LocationDto, ['id'] as const) {}
