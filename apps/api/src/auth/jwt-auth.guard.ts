import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers['authorization'] as string | undefined;

    if (!auth?.startsWith('Bearer ')) throw new UnauthorizedException('Missing token');

    try {
      const token = auth.slice('Bearer '.length);
      const secret = process.env.JWT_ACCESS_SECRET || 'default-secret-change-in-production';
      const payload = jwt.verify(token, secret) as any;

      req.user = { id: payload.sub, email: payload.email };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

