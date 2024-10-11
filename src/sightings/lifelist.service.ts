import { DatabaseService } from 'src/database/database.service';

export class LifeListService {
  constructor(private readonly databaseService: DatabaseService) {}

  //---- FETCH USER'S LIFE LIST
  findLifeList(id: number) {
    return `id ${id} life list`;
  }
}
