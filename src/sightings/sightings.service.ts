import { Injectable } from '@nestjs/common';
import { CreateSightingDto } from './dto/create-sighting.dto';
import { UpdateSightingDto } from './dto/update-sighting.dto';

@Injectable()
export class SightingsService {
  //---- CREATE NEW SIGHTING
  create(createSightingDto: CreateSightingDto) {
    return 'This action adds a new sighting';
  }

  //---- FETCH ALL SIGHTINGS BY USER
  findAll() {
    return `This action returns all sightings`;
  }

  //---- FETCH A SIGHTING
  findOne(id: number) {
    return `This action returns a #${id} sighting`;
  }

  //---- UPDATE A SIGHTING
  update(id: number, updateSightingDto: UpdateSightingDto) {
    return `This action updates a #${id} sighting`;
  }

  //---- DELETE A SIGHTING
  remove(id: number) {
    return `This action removes a #${id} sighting`;
  }
}
