import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { BIRD_COUNT } from '../../common/constants';
import { ErrorMessages } from '../../common/models';

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
  @MinLength(1)
  @ValidateIf((_, value) => value !== null)
  readonly name: string;

  @IsString()
  @Length(1, 150, {
    message: ErrorMessages.BadRequest,
  })
  @ValidateIf((_, value) => value !== null)
  readonly bio: string;

  @IsString()
  @Matches(/^\d{5}$/, { message: ErrorMessages.BadRequest })
  @ValidateIf((_, value) => value !== null)
  readonly zipcode: string;

  @IsString()
  @MinLength(1)
  @ValidateIf((_, value) => value !== null)
  readonly address: string;

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

export class UpdateUserProfileDto extends PickType(UserDto, [
  'address',
  'bio',
  'name',
  'zipcode',
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
