import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { hashPassword } from 'src/auth/auth.helpers';

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

    const hashedPassword = await hashPassword(password);

    return this.databaseService.user.create({
      data: { ...createUserDto, password: hashedPassword },
      omit: {
        password: true,
      },
    });
  }

  // Find a user by id
  async findById(id: number) {
    const user = await this.databaseService.user.findUnique({
      where: { id },
      omit: { password: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Find a user by email
  findByEmail(email: string) {
    return this.databaseService.user.findUnique({ where: { email } });
  }

  // Find all users
  findAll() {
    return this.databaseService.user.findMany({
      include: { profile: true },
      omit: { password: true },
    });
  }

  // Update a user
  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const findUser = await this.findById(id);

    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    return this.databaseService.profile.update({
      where: { user_id: id },
      data: updateProfileDto,
    });
  }

  // Remove a user from the database
  async remove(id: number) {
    const findUser = await this.findById(id);

    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    return this.databaseService.user.delete({
      where: { id },
      select: { id: true },
    });
  }
}
