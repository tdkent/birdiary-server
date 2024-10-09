import { IsDate, IsInt, IsString, Length, Max, Min } from 'class-validator';
import { BIRD_COUNT } from 'src/common/constants/bird.constants';
export class CreateSightingDto {
  @IsInt()
  @Min(1)
  @Max(BIRD_COUNT)
  readonly bird_id: number;

  @IsDate()
  readonly date: Date;

  @IsString()
  @Length(0, 150)
  readonly desc: string;
}
