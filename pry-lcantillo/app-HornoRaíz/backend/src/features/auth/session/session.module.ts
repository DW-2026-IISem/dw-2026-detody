import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SessionController } from './session.controller.js';
import { SessionService } from './session.service.js';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'hornoraiz-secret-key-change-me-0123456789',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}