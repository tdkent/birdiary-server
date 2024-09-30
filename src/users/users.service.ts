import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  create(usersServiceDto: { email: string; password: string }) {
    const { email, password } = usersServiceDto;
    return `email: ${email}, password: ${password}`;
  }
}
