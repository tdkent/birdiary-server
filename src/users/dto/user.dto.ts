import { PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSightingDto } from 'src/sightings/dto/sighting.dto';

class UserDto {
  @IsInt()
  readonly id: number;

  @IsEmail({}, { message: 'Please submit a valid email address.' })
  readonly email: string;

  @IsString()
  @Length(8, 36, {
    message: 'Password must be between 8 and 36 characters.',
  })
  readonly password: string;

  @IsString()
  @ValidateIf((_, value) => value !== null)
  readonly name: string;

  @IsInt()
  @ValidateIf((_, value) => value !== null)
  readonly locationId: number;

  @IsInt()
  @ValidateIf((_, value) => value !== null)
  readonly favoriteBirdId: number;
}

export class AuthDto extends PickType(UserDto, [
  'email',
  'password',
] as const) {}

export class AuthWithSightingsDto extends AuthDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSightingDto)
  readonly storageData: CreateSightingDto[];
}

export class UpdateUserProfileDto extends PickType(UserDto, [
  'name',
  'favoriteBirdId',
  'locationId',
] as const) {}

export class UpdateUserPasswordDto {
  @IsString()
  @Length(8, 36, {
    message: 'Password must be between 8 and 36 characters.',
  })
  readonly currentPassword: string;

  @IsString()
  @Length(8, 36, {
    message: 'Password must be between 8 and 36 characters.',
  })
  readonly newPassword: string;
}
