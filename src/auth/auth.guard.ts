import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokenString = request.headers.authorization;

    if (!tokenString) {
      throw new UnauthorizedException('This request is not authorized');
    }

    const type = tokenString.split(' ')[0];
    const token = tokenString.split(' ')[1];

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('This request is not authorized');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_KEY,
      });

      // assign the payload to the request object
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('This request is not authorized');
    }

    return true;
  }
}
