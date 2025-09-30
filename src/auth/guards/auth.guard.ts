import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { verifyJwt } from '../jwt.util';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request & { user?: any }>();
    const auth = req.headers['authorization'];
    if (!auth || Array.isArray(auth)) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const [type, token] = auth.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }
    const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
    try {
      const claims = verifyJwt(token, secret);
      if (claims.token !== 'access') {
        throw new UnauthorizedException('Invalid token type');
      }
      (req as any).user = {
        id: claims.sub,
        email: claims.email,
        role: claims.role,
        type: claims.type,
      };
      return true;
    } catch (e) {
      throw new UnauthorizedException((e as Error).message || 'Invalid token');
    }
  }
}
