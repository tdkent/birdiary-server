import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtVerify } from 'jose';
import { sessionKey } from '../constants/env.constants';
import ErrorMessages from '../errors/errors.enum';

const encodedKey = new TextEncoder().encode(sessionKey);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokenString = request.headers.authorization;

    if (!tokenString) {
      // A token is optional for '/birds'
      if (request.url.startsWith('/api/birds')) {
        request['user'] = { id: '' };
        return true;
      }
      throw new UnauthorizedException(ErrorMessages.InvalidToken);
    }

    const type = tokenString.split(' ')[0];
    const token = tokenString.split(' ')[1];

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException(ErrorMessages.InvalidToken);
    }

    try {
      const { payload } = await jwtVerify(token, encodedKey, {
        algorithms: ['HS256'],
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException(ErrorMessages.InvalidToken);
    }

    return true;
  }
}
