import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../utils/constants';
import 'dotenv/config';

const { JWT_SECRET_KEY } = process.env;

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate = async (context: ExecutionContext) => {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const sessionToken = request.headers.authorization?.split(' ')[1];

    try {
      if (!sessionToken)
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      jwt.verify(sessionToken, JWT_SECRET_KEY);
      return true;
    } catch (err) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  };
}
