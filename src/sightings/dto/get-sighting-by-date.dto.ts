import { PickType } from '@nestjs/swagger';
import { CreateSightingDto } from './create-sighting.dto';

export class GetSightingByDateDto extends PickType(CreateSightingDto, [
  'date',
] as const) {}
