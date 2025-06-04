import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetSightingByDateQueryDto {
  @IsOptional()
  @IsIn(['alphaAsc', 'alphaDesc'])
  readonly sortBy: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Invalid query' })
  @Min(1, { message: 'Invalid query' })
  readonly page?: number;
}
