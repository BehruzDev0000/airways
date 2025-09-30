import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../guards/roles.guard';

export const Roles = (...roles: (Role | string)[]) => SetMetadata(ROLES_KEY, roles);
