import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';
import { Roles } from './roles.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export const Auth = (...roles: (Role | string)[]) =>
  applyDecorators(ApiBearerAuth(), UseGuards(AuthGuard, RolesGuard), Roles(...roles));
