import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GroupSightingDto {
  @IsOptional()
  @IsIn(['date', 'bird', 'location', 'lifelist'], { message: 'Invalid query' })
  readonly groupBy?: string;

  @IsOptional()
  @IsIn(['alphaAsc', 'alphaDesc', 'count', 'dateAsc', 'dateDesc'])
  readonly sortBy: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Invalid query' })
  @Min(1, { message: 'Invalid query' })
  readonly page?: number;
}
