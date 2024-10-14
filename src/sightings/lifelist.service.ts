import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class LifeListService {
  constructor(private readonly databaseService: DatabaseService) {}

  //---- FETCH USER'S LIFE LIST
  findLifeList(id: number) {
    return this.databaseService.sighting.findMany({
      where: { user_id: id },
      distinct: ['bird_id'],
    });
  }
}
