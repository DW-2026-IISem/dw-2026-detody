import dotenv from 'dotenv';
import { DbDialect, IDbBlock, IEnvConfig } from './env.interface.js';
import { validateEnv } from './env.validation.js';

export const ENV_CONFIG = Symbol('ENV_CONFIG');

function toBlock(prefix: string, raw: Record<string, unknown>, defaultPort: number): IDbBlock {
  return {
    host: String(raw[`DB_${prefix}_HOST`] ?? 'localhost'),
    port: Number(raw[`DB_${prefix}_PORT`] ?? defaultPort),
    username: String(raw[`DB_${prefix}_USERNAME`] ?? ''),
    password: String(raw[`DB_${prefix}_PASSWORD`] ?? ''),
    name: String(raw[`DB_${prefix}_NAME`] ?? ''),
  };
}

export function loadEnvConfig(): IEnvConfig {
  dotenv.config();
  const raw = process.env as Record<string, unknown>;
  validateEnv(raw);
  return {
    port: Number(raw.PORT ?? 3004),
    nodeEnv: String(raw.NODE_ENV ?? 'development'),
    dbDialect: String(raw.DB_DIALECT) as DbDialect,
    mysql: toBlock('MYSQL', raw, 3306),
    postgres: toBlock('POSTGRES', raw, 5432),
    mssql: toBlock('MSSQL', raw, 1433),
    oracle: toBlock('ORACLE', raw, 1521),
  };
}
