import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<(Role | string)[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const req = context.switchToHttp().getRequest<{ user?: { role?: Role } }>();
    const role = req.user?.role;
    const normalize = (r: string): Role | undefined => {
      const key = r.replace(/\s+/g, '').toLowerCase();
      if (key === 'super_admin' || key === 'superadmin') return 'superadmin';
      if (key === 'admin') return 'admin';
      if (key === 'worker') return 'worker';
      if (key === 'user') return 'user';
      return undefined;
    };
    const allowed = requiredRoles
      .map((r) => normalize(String(r)))
      .filter((x): x is Role => Boolean(x));
    if (role && allowed.includes(role)) {
      return true;
    }
    throw new ForbiddenException('Insufficient role');
  }
}
