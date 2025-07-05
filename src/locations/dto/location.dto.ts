import { IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';

export class LocationDto {
  @IsString()
  @MaxLength(255)
  readonly name: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  readonly lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  readonly lng: number;
}
