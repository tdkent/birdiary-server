import { PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ErrorMessages } from 'src/common/models';
import { CreateSightingDto } from 'src/sightings/dto/sighting.dto';
import { BIRD_COUNT } from 'src/common/constants';

class UserDto {
  @Type(() => Number) // cast id type to use in params DTO
  @IsInt({ message: ErrorMessages.BadRequest })
  @Min(1, { message: ErrorMessages.BadRequest })
  readonly id: number;

  @IsEmail({}, { message: ErrorMessages.InvalidEmail })
  readonly email: string;

  @IsString()
  @Length(8, 36, {
    message: ErrorMessages.InvalidPassword,
  })
  readonly password: string;

  @IsString()
  @ValidateIf((_, value) => value !== null)
  readonly name: string;

  @IsInt()
  @Min(1, { message: ErrorMessages.BadRequest })
  @ValidateIf((_, value) => value !== null)
  readonly locationId: number;

  @IsInt()
  @Min(1, { message: ErrorMessages.BadRequest })
  @Max(BIRD_COUNT, { message: ErrorMessages.BadRequest })
  @ValidateIf((_, value) => value !== null)
  readonly favoriteBirdId: number;
}

export class AuthDto extends PickType(UserDto, [
  'email',
  'password',
] as const) {}

export class AuthWithSightingsDto extends AuthDto {
  @IsOptional()
  @IsArray({ message: ErrorMessages.BadRequest })
  @ValidateNested({ each: true })
  @Type(() => CreateSightingDto)
  readonly storageData: CreateSightingDto[];
}

export class UserIdDto extends PickType(UserDto, ['id'] as const) {}

export class UpdateUserProfileDto extends PickType(UserDto, [
  'name',
  'favoriteBirdId',
  'locationId',
] as const) {}

export class UpdateUserPasswordDto {
  @IsString()
  @Length(8, 36, {
    message: ErrorMessages.InvalidPassword,
  })
  readonly currentPassword: string;

  @IsString()
  @Length(8, 36, {
    message: ErrorMessages.InvalidPassword,
  })
  readonly newPassword: string;
}
