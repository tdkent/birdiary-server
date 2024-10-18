import { IsIn, IsOptional } from 'class-validator';

export class GroupSightingDto {
  @IsOptional()
  @IsIn(['date', 'bird_id', 'location_id'])
  readonly groupby?: string;
}
