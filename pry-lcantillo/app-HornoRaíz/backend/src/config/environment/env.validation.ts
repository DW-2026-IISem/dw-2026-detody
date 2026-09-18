import { plainToInstance } from 'class-transformer';
import { IsIn, IsNotEmpty, ValidateIf, validateSync } from 'class-validator';

const DIALECTS = ['mysql', 'postgres', 'mssql', 'oracle'];

export class EnvVariables {
  @IsIn(DIALECTS, { message: 'DB_DIALECT debe ser mysql | postgres | mssql | oracle' })
  DB_DIALECT!: string;

  @ValidateIf((o) => o.DB_DIALECT === 'mysql')
  @IsNotEmpty({ message: 'DB_MYSQL_HOST es requerida' })
  DB_MYSQL_HOST?: string;
}

export function validateEnv(raw: Record<string, unknown>): EnvVariables {
  const config = plainToInstance(EnvVariables, raw);
  const errors = validateSync(config, { whitelist: false, forbidNonWhitelisted: false });
  if (errors.length > 0) {
    const messages = errors.map((e) => Object.values(e.constraints ?? {}).join('; ')).join(' | ');
    throw new Error(`Error de configuración: ${messages}`);
  }
  return config;
}
