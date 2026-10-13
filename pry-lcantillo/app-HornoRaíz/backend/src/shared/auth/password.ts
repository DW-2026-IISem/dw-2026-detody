import { createHash, randomBytes } from 'node:crypto';

export function sha256Hex(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

export function generateOpaqueToken(): string {
  return randomBytes(32).toString('hex');
}
