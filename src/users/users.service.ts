import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createUserDto: Prisma.UserCreateInput) {
    return this.databaseService.user.create({ data: createUserDto });
  }

  findOne(id: number) {
    return this.databaseService.user.findUnique({ where: { id } });
  }

  findAll() {
    return this.databaseService.user.findMany();
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.user.delete({ where: { id } });
  }
}
