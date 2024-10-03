import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { LoginUserDto } from './dtos/login-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async signin(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comparePasswords = await compare(password, user.password);

    if (!comparePasswords) {
      throw new UnauthorizedException('Incorrect password');
    }
    // create jwt

    // create response obj with token
    return 'hello world!!';
  }
}
