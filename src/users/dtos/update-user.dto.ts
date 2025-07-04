import { IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MaxLength(24, {
    message: 'Name cannot be longer than 60 characters',
  })
  readonly name: string;

  @IsString()
  @MaxLength(120, {
    message: 'Location cannot be longer than 120 characters',
  })
  readonly location: string;
}
