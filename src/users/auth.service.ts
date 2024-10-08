import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  //---- SIGN IN A USER. ERROR ON FAIL, TOKEN ON SUCCESS.
  async signin(loginUser: CreateUserDto) {
    const { email, password } = loginUser;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comparePasswords = await compare(password, user.password);

    if (!comparePasswords) {
      throw new UnauthorizedException('Incorrect password');
    }

    const payload = { id: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return { id: user.id, email: user.email, token };
  }
}
