import { Global, Module } from '@nestjs/common';
import { ENV_CONFIG, IEnvConfig } from '../../../config/environment/index.js';
import { sequelizeFactory } from './sequelize.factory.js';

export const SEQUELIZE = 'SEQUELIZE';

@Global()
@Module({
  providers: [
    {
      provide: SEQUELIZE,
      inject: [ENV_CONFIG],
      useFactory: async (cfg: IEnvConfig) => {
        const sequelize = sequelizeFactory(cfg);
        await sequelize.authenticate();
        await sequelize.sync({ alter: false });
        return sequelize;
      },
    },
  ],
  exports: [SEQUELIZE],
})
export class SequelizeModule {}
