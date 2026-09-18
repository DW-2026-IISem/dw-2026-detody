import { Sequelize } from 'sequelize-typescript';
import { getDbBlock, IEnvConfig } from '../../../config/environment/index.js';

export const ALL_MODELS: any[] = [];

export function sequelizeFactory(cfg: IEnvConfig): Sequelize {
  const block = getDbBlock(cfg);
  return new Sequelize({
    dialect: cfg.dbDialect,
    host: block.host,
    port: block.port,
    username: block.username,
    password: block.password,
    database: block.name,
    models: ALL_MODELS,
    logging: false,
  });
}
