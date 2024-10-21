import { IsIn, IsOptional } from 'class-validator';

export class GroupSightingDto {
  @IsOptional()
  @IsIn(['date', 'bird', 'location'])
  readonly groupby?: string;
}
