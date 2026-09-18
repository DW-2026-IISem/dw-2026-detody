import { Global, Module } from '@nestjs/common';
import { ENV_CONFIG, loadEnvConfig } from './env.config.js';

@Global()
@Module({
  providers: [{ provide: ENV_CONFIG, useFactory: () => loadEnvConfig() }],
  exports: [ENV_CONFIG],
})
export class EnvironmentModule {}
