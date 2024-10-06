import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BirdService {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll() {
    return this.databaseService.bird.findMany({
      include: { images: true },
    });
  }

  findOne(id: number) {
    return this.databaseService.bird.findUnique({
      where: { id },
    });
  }
}
