import { IsNumber, IsString, Max, Min } from 'class-validator';

export class LocationDto {
  @IsString({ message: 'Invalid request.' })
  readonly name: string;

  @IsNumber({}, { message: 'Invalid request.' })
  @Min(-90, { message: 'Invalid request.' })
  @Max(90, { message: 'Invalid request.' })
  readonly lat: number;

  @IsNumber({}, { message: 'Invalid request.' })
  @Min(-180, { message: 'Invalid request.' })
  @Max(180, { message: 'Invalid request.' })
  readonly lng: number;
}
