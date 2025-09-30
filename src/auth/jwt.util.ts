import { createHmac, timingSafeEqual } from 'crypto';
import { Role } from './enums/role.enum';

export type PrincipalType = 'admin' | 'user' | 'worker';

export type TokenKind = 'access' | 'refresh';

export interface JwtClaims {
  sub: number;
  email: string;
  role: Role;
  type: PrincipalType;
  token: TokenKind;
  iat: number;
  exp: number;
}

const base64url = (input: Buffer | string) =>
  Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const base64urlJSON = (obj: any) => base64url(Buffer.from(JSON.stringify(obj)));

const decodePart = (part: string) => {
  const pad = 4 - (part.length % 4 || 4);
  const b64 = part.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad);
  return Buffer.from(b64, 'base64').toString('utf8');
};

export function signJwt(
  payload: Omit<JwtClaims, 'iat' | 'exp'>,
  secret: string,
  expiresInSec: number,
): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + Math.max(1, Math.floor(expiresInSec));
  const fullPayload: JwtClaims = { ...payload, iat, exp } as JwtClaims;
  const headerPart = base64urlJSON(header);
  const payloadPart = base64urlJSON(fullPayload);
  const data = `${headerPart}.${payloadPart}`;
  const signature = createHmac('sha256', secret).update(data).digest();
  const signaturePart = base64url(signature);
  return `${data}.${signaturePart}`;
}

export function verifyJwt(token: string, secret: string): JwtClaims {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }
  const [headerPart, payloadPart, signaturePart] = parts;
  const data = `${headerPart}.${payloadPart}`;
  const expected = createHmac('sha256', secret).update(data).digest();
  const expectedB64url = base64url(expected);
  const a = Buffer.from(signaturePart);
  const b = Buffer.from(expectedB64url);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new Error('Invalid signature');
  }
  const json = decodePart(payloadPart);
  const claims: JwtClaims = JSON.parse(json);
  if (!claims || typeof claims !== 'object') {
    throw new Error('Invalid token payload');
  }
  if (typeof claims.exp !== 'number' || Math.floor(Date.now() / 1000) >= claims.exp) {
    throw new Error('Token expired');
  }
  return claims;
}
