import {
  Body,
  Controller,
  HttpCode,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin') // POST '/auth/signin'
  @HttpCode(200)
  signin(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    return this.authService.signin(loginUserDto);
  }
}
