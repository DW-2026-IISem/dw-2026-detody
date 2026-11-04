



import { Sequelize } from 'sequelize-typescript';
import { getDbBlock, IEnvConfig } from '../../../config/environment/index.js';
import { UserModel } from '../../../features/auth/infrastructure/models/user.model.js';
import { RoleModel } from '../../../features/auth/infrastructure/models/role.model.js';
import { ResourceModel } from '../../../features/auth/infrastructure/models/resource.model.js';
import { RoleUserModel } from '../../../features/auth/infrastructure/models/role-user.model.js';
import { ResourceRoleModel } from '../../../features/auth/infrastructure/models/resource-role.model.js';
import { RefreshTokenModel } from '../../../features/auth/infrastructure/models/refresh-token.model.js';
import { ClientModel } from '../../../features/business/clients/infrastructure/persistence/models/client.model.js';
import { ProductTypeModel } from '../../../features/business/product-types/infrastructure/persistence/models/product-type.model.js';
import { ProductModel } from '../../../features/business/products/infrastructure/persistence/models/product.model.js';
import { SaleModel } from '../../../features/business/sales/infrastructure/persistence/models/sale.model.js';
import { SaleItemModel } from '../../../features/business/sales/infrastructure/persistence/models/sale-item.model.js';

export const ALL_MODELS: any[] = [
  UserModel,
  RoleModel,
  ResourceModel,
  RoleUserModel,
  ResourceRoleModel,
  RefreshTokenModel,
  ClientModel,
  ProductTypeModel,
  ProductModel,
  SaleModel,
  SaleItemModel,
];

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
