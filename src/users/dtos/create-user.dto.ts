import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please submit a valid email address.' })
  readonly email: string;

  @IsString()
  @Length(8, 36, {
    message: 'Password must be between 8 and 36 characters.',
  })
  readonly password: string;

  @IsString()
  @Length(0, 36, {
    message: 'Name cannot be longer than 36 characters.',
  })
  readonly name: string;
}
