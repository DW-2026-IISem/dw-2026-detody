// src/features/auth/infrastructure/models/role.model.ts
import { Table, Column, Model, DataType, Unique, BeforeValidate, BelongsToMany } from 'sequelize-typescript';
import { UserModel } from './user.model';
import { RoleUserModel } from './role-user.model';
import { ResourceModel } from './resource.model';
import { ResourceRoleModel } from './resource-role.model';

@Table({ tableName: 'roles', timestamps: true })
export class RoleModel extends Model {
  @Unique('uq_roles_name')
  @Column({ type: DataType.STRING(80), allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  description?: string;

  @Column({ type: DataType.ENUM('active', 'inactive'), defaultValue: 'inactive', allowNull: false })
  status!: 'active' | 'inactive';

  @BelongsToMany(() => UserModel, () => RoleUserModel)
  users!: UserModel[];

  @BelongsToMany(() => ResourceModel, () => ResourceRoleModel)
  resources!: ResourceModel[];

  @BeforeValidate
  static uppercaseName(instance: RoleModel) {
    if (instance.name) instance.name = instance.name.trim().toUpperCase();
  }
}