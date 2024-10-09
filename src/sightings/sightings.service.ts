import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateSightingDto } from './dto/create-sighting.dto';
import { UpdateSightingDto } from './dto/update-sighting.dto';

@Injectable()
export class SightingsService {
  constructor(private readonly databaseService: DatabaseService) {}
  //---- CREATE NEW SIGHTING
  create(id: number, createSightingDto: CreateSightingDto) {
    return this.databaseService.sighting.create({
      data: { user_id: id, ...createSightingDto },
    });
  }

  //---- FETCH ALL SIGHTINGS BY USER
  findAll(id: number) {
    return this.databaseService.sighting.findMany({
      where: { user_id: id },
    });
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
