import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash as bcryptHash } from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Create a new user
  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const findExistingEmail = await this.findByEmail(email);

    if (findExistingEmail) {
      throw new BadRequestException(`${email} is already registed!`);
    }

    const saltRounds = 10;
    const hashedPassword = await bcryptHash(password, saltRounds);

    return this.databaseService.user.create({
      data: { ...createUserDto, password: hashedPassword },
      omit: {
        password: true,
      },
    });
  }

  // Find a user by their id
  async findById(id: number) {
    const user = await this.databaseService.user.findUnique({
      where: { id },
      omit: { password: true },
    });

    if (!user) {
      throw new NotFoundException('The requested user does not exist!');
    }

    return user;
  }

  // Find a user by their email
  findByEmail(email: string) {
    return this.databaseService.user.findUnique({ where: { email } });
  }

  // Find all users
  findAll() {
    return this.databaseService.user.findMany({ omit: { password: true } });
  }

  // Update a user
  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  // Remove a user from the database
  async remove(id: number) {
    return this.databaseService.user.delete({ where: { id } });
  }
}
