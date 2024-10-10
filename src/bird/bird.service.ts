import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BirdService {
  constructor(private readonly databaseService: DatabaseService) {}

  //---- FETCH ALL BIRDS
  async findAll() {
    return this.databaseService.bird
      .findMany({
        include: { images: true, species: true },
        omit: { spec_id: true },
        take: 20,
      })
      .catch(() => {
        throw new InternalServerErrorException('An error occurred');
      });
  }

  //---- FETCH A SINGLE BIRD
  async findOne(id: number) {
    return this.databaseService.bird
      .findUniqueOrThrow({
        where: { id },
        include: { images: true, species: true },
        omit: { spec_id: true },
      })
      .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            throw new NotFoundException('Resource does not exist');
          }
        }
        throw new InternalServerErrorException('An error occurred');
      });
  }
}
