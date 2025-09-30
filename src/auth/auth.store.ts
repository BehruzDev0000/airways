import { Injectable } from '@nestjs/common';
import { Role } from './enums/role.enum';

export interface AuthPrincipal {
  id: number;
  email: string;
  role: Role;
  type: 'admin' | 'user' | 'worker';
}

@Injectable()
export class AuthStore {
  private sessions = new Map<string, AuthPrincipal>();

  set(token: string, principal: AuthPrincipal) {
    this.sessions.set(token, principal);
  }

  get(token: string): AuthPrincipal | undefined {
    return this.sessions.get(token);
  }

  delete(token: string) {
    this.sessions.delete(token);
  }
}

