// src/features/auth/infrastructure/models/role-user.model.ts
import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { UserModel } from './user.model';
import { RoleModel } from './role.model';

@Table({ tableName: 'role_users', timestamps: true })
export class RoleUserModel extends Model {
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id!: number;

  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  role_id!: number;

  @Column({ type: DataType.ENUM('active', 'inactive'), defaultValue: 'inactive', allowNull: false })
  status!: 'active' | 'inactive';
}