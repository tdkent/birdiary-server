import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { hashPassword } from '../auth/auth.helpers';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  //---- CREATE A NEW USER
  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const findExistingEmail = await this.findByEmail(email);

    if (findExistingEmail) {
      throw new BadRequestException(`${email} is already registed!`);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await this.databaseService.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            name: '',
            location: '',
          },
        },
      },
      omit: { password: true },
      include: { profile: true },
    });

    return newUser;
  }

  // Find a user by email
  findByEmail(email: string) {
    return this.databaseService.user.findUnique({ where: { email } });
  }

  // Find all users
  findAll() {
    return this.databaseService.user.findMany({
      omit: { password: true },
    });
  }

  //---- DELETE USER (CASCADES PROFILE, FAVORITE)
  async remove(id: number) {
    return this.databaseService.user.delete({
      where: { id },
      select: { id: true },
    });
  }
}
