import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../guards/roles.guard';

// Accept both typed roles and arbitrary strings (e.g., 'ADMIN', 'SUPER_ADMIN').
export const Roles = (...roles: (Role | string)[]) => SetMetadata(ROLES_KEY, roles);
