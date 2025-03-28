import { IsIn } from 'class-validator';
import birdNames from 'db/birds';

export class GetSightingsByBirdDto {
  @IsIn(birdNames, {
    message: 'Not a valid bird',
  })
  readonly commName: string;
}
