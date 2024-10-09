import { Injectable } from '@nestjs/common';
import { CreateSightingDto } from './dto/create-sighting.dto';
import { UpdateSightingDto } from './dto/update-sighting.dto';

@Injectable()
export class SightingsService {
  create(createSightingDto: CreateSightingDto) {
    return 'This action adds a new sighting';
  }

  findAll() {
    return `This action returns all sightings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sighting`;
  }

  update(id: number, updateSightingDto: UpdateSightingDto) {
    return `This action updates a #${id} sighting`;
  }

  remove(id: number) {
    return `This action removes a #${id} sighting`;
  }
}
