import { IsString, Length } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @Length(0, 36, {
    message: 'Name cannot be longer than 36 characters',
  })
  readonly name: string;

  @IsString()
  @Length(0, 60, {
    message: 'Location cannot be longer than 60 characters',
  })
  readonly location: string;
}
