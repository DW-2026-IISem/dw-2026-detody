import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RefreshTokenModel } from './refresh-token.model';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { RefreshTokensService } from './refresh-tokens.service';
import { RefreshTokensController } from './refresh-tokens.controller';

@Module({
  imports: [SequelizeModule.forFeature([RefreshTokenModel])],
  controllers: [RefreshTokensController],
  providers: [RefreshTokensRepository, RefreshTokensService],
  exports: [RefreshTokensRepository, RefreshTokensService],
})
export class RefreshTokensModule {}
