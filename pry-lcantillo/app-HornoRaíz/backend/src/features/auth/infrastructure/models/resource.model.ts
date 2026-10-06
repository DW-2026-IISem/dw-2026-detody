// src/features/auth/infrastructure/models/resource.model.ts
import { Table, Column, Model, DataType, Index, BeforeValidate, BelongsToMany } from 'sequelize-typescript';
import { normalizePath } from '../../../../shared/auth/resource-match.util';
import { RoleModel } from './role.model';
import { ResourceRoleModel } from './resource-role.model';

@Table({ tableName: 'resources', timestamps: true })
export class ResourceModel extends Model {
  @Index({ name: 'uq_resources_method_path', unique: true })
  @Column({ type: DataType.STRING(10), allowNull: false })
  method!: string;

  @Index({ name: 'uq_resources_method_path', unique: true })
  @Column({ type: DataType.STRING(255), allowNull: false })
  path!: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  description?: string;

  @Column({ type: DataType.ENUM('active', 'inactive'), defaultValue: 'inactive', allowNull: false })
  status!: 'active' | 'inactive';

  @BelongsToMany(() => RoleModel, () => ResourceRoleModel)
  roles!: RoleModel[];

  @BeforeValidate
  static normalizeMethodAndPath(instance: ResourceModel) {
    if (instance.method) instance.method = instance.method.trim().toUpperCase();
    if (instance.path) instance.path = normalizePath(instance.path.trim());
  }
}