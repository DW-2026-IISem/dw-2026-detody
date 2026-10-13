import { Sequelize } from 'sequelize-typescript';

let globalSequelizeInstance: Sequelize | null = null;

export function setGlobalSequelize(sequelize: Sequelize): void {
  globalSequelizeInstance = sequelize;
}

export async function withTransaction<T>(
  callback: (transaction: any) => Promise<T>,
  sequelizeInstance?: Sequelize
): Promise<T> {
  const seq = sequelizeInstance || globalSequelizeInstance;
  if (!seq) {
    throw new Error('Sequelize instance is not configured for withTransaction');
  }
  return seq.transaction(callback);
}
