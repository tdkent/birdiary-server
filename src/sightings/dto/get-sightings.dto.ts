import { IsEnum, IsOptional } from 'class-validator';

export class GetSightingsDto {
  @IsOptional()
  @IsEnum(['locations', 'lifelist'], { message: 'Invalid parameter' })
  readonly get?: 'locations' | 'lifelist';
}
