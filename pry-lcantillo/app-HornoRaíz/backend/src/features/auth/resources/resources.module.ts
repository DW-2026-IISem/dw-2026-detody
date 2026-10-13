import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ResourceModel } from '../infrastructure/models/resource.model';
import { ResourceController } from './infrastructure/resource.controller';
import { ResourceService } from './application/resource.service';
import { ResourceRepository } from './infrastructure/resource.repository';

@Module({
  imports: [SequelizeModule.forFeature([ResourceModel])],
  controllers: [ResourceController],
  providers: [ResourceService, ResourceRepository],
  exports: [ResourceService],
})
export class ResourcesModule {}
