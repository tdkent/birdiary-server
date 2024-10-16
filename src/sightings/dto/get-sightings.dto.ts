import { Equals, IsOptional } from 'class-validator';

export class GetSightingsDto {
  @IsOptional()
  @Equals('lifelist')
  readonly get?: 'lifelist';
}
