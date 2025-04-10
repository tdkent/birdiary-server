import { IsString, Length, Matches } from 'class-validator';

export class GetBirdsByAlphaDto {
  @IsString()
  @Length(1, 1, {
    message: 'Query string must be a single character A-Z',
  })
  @Matches(/[A-Z]/, {
    message: 'Query string must be a single character A-Z',
  })
  readonly startsWith: string;
}
