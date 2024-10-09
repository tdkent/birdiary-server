import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(36, {
    message: 'Name cannot be longer than 36 characters',
  })
  readonly name: string;

  @IsOptional()
  @IsString()
  @MaxLength(60, {
    message: 'Location cannot be longer than 60 characters',
  })
  readonly location: string;
}
