// src/features/auth/infrastructure/models/resource-role.model.ts
import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { RoleModel } from './role.model';
import { ResourceModel } from './resource.model';

@Table({ tableName: 'resource_roles', timestamps: true })
export class ResourceRoleModel extends Model {
  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  role_id!: number;

  @ForeignKey(() => ResourceModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  resource_id!: number;

  @Column({ type: DataType.ENUM('active', 'inactive'), defaultValue: 'inactive', allowNull: false })
  status!: 'active' | 'inactive';
}