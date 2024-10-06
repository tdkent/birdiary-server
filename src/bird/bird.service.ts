import { Injectable } from '@nestjs/common';
import { CreateBirdDto } from './dto/create-bird.dto';
import { UpdateBirdDto } from './dto/update-bird.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BirdService {
  constructor(private readonly databaseService: DatabaseService) {}
  create(createBirdDto: CreateBirdDto) {
    return 'This action adds a new bird';
  }

  findAll() {
    return this.databaseService.bird.findMany({
      include: { images: true },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} bird`;
  }

  update(id: number, updateBirdDto: UpdateBirdDto) {
    return `This action updates a #${id} bird`;
  }

  remove(id: number) {
    return `This action removes a #${id} bird`;
  }
}
