import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSightingDto } from 'src/sightings/dto/create-sighting.dto';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please submit a valid email address.' })
  readonly email: string;

  @IsString()
  @Length(8, 36, {
    message: 'Password must be between 8 and 36 characters.',
  })
  readonly password: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSightingDto)
  readonly storageData: CreateSightingDto[];
}
