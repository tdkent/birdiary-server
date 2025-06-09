import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetSightingByLocationQueryDto {
  @IsOptional()
  @IsIn(['alphaAsc', 'alphaDesc', 'dateAsc', 'dateDesc'])
  readonly sortBy: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Invalid query' })
  @Min(1, { message: 'Invalid query' })
  readonly page?: number;
}
