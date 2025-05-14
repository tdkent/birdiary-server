import { IsIn, IsOptional } from 'class-validator';

export class GroupSightingDto {
  @IsOptional()
  @IsIn(['date', 'bird', 'location', 'lifelist'])
  readonly groupBy?: string;
}
