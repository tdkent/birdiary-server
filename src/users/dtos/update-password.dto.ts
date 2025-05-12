import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(8, {
    message: 'Passwords must be 8-36 characters',
  })
  readonly currentPassword: string;

  @IsString()
  @MaxLength(36, {
    message: 'Passwords must be 8-36 characters',
  })
  readonly newPassword: string;
}
