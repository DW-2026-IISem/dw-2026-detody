import * as jwt from 'jsonwebtoken';

export function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}

export function verifyAccessToken(token: string): any {
  const secret = process.env.JWT_SECRET || 'secret';
  return jwt.verify(token, secret);
}
