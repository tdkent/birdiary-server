import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BirdService {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll() {
    return this.databaseService.bird.findMany({
      include: { images: true, species: true },
      omit: { spec_id: true },
      take: 50,
    });
  }

  findOne(id: number) {
    return this.databaseService.bird.findUnique({
      where: { id },
    });
  }
}
