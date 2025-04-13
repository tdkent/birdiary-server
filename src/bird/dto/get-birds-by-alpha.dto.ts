import { IsInt, IsOptional, Length, Matches, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetBirdsByAlphaDto {
  @IsOptional()
  @Length(1, 1, {
    message: '"startsWith" query must be a single character A-Z',
  })
  @Matches(/[A-Z]/, {
    message: '"startsWith" query must be a single character A-Z',
  })
  readonly startsWith: string;

  @Type(() => Number)
  @IsInt({ message: '"page" must be an integer 1-34' })
  @Min(1, { message: '"page" must be an integer 1-34' })
  @Max(34, { message: '"page" must be an integer 1-34' })
  readonly page: number;
}
