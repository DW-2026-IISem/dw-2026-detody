import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { RoleModel } from './role.model.js';
import { ResourceModel } from './resource.model.js';

@Table({ tableName: 'auth_resource_roles', timestamps: false })
export class ResourceRoleModel extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id!: number;

  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  role_id!: number;

  @ForeignKey(() => ResourceModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  resource_id!: number;

  // DECLARACIÓN DE LA COLUMNA STATUS:
  @Column({ type: DataType.ENUM('active', 'inactive'), defaultValue: 'active' })
  status!: 'active' | 'inactive';

  @BelongsTo(() => RoleModel)
  role!: RoleModel;

  @BelongsTo(() => ResourceModel)
  resource!: ResourceModel;
}