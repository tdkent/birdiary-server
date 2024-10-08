import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { hashPassword } from '../common/helpers/auth.helpers';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  //---- CREATE A NEW USER W/DEFAULT PROFILE
  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const findExistingEmail = await this.findByEmail(email);

    if (findExistingEmail) {
      throw new BadRequestException(`${email} is already registed!`);
    }

    const hashedPassword = await hashPassword(password);

    return await this.databaseService.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {},
        },
      },
      omit: { password: true },
      include: { profile: true },
    });
  }

  //---- UTILITY: FIND USER BY EMAIL
  //!--- REDUNDANT WITH ERROR HANDLING
  findByEmail(email: string) {
    return this.databaseService.user.findUnique({ where: { email } });
  }

  //---- FETCH ALL USERS
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
