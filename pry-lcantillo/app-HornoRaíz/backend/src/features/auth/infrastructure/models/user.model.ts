// src/features/auth/infrastructure/models/user.model.ts
import { Table, Column, Model, DataType, Unique, BeforeCreate, BeforeUpdate, HasMany, BelongsToMany } from 'sequelize-typescript';
import { hashPassword } from '../../../../shared/auth/password.util';
import { RoleModel } from './role.model';
import { RoleUserModel } from './role-user.model';
import { RefreshTokenModel } from './refresh-token.model';

@Table({ tableName: 'users', timestamps: true })
export class UserModel extends Model {
  @Unique('uq_users_username')
  @Column({ type: DataType.STRING(80), allowNull: false })
  username!: string;

  @Unique('uq_users_email')
  @Column({ type: DataType.STRING(150), allowNull: false })
  email!: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  password!: string;

  @Column({ type: DataType.STRING(500), allowNull: true })
  avatar?: string;

  @Column({ type: DataType.ENUM('active', 'inactive'), defaultValue: 'inactive', allowNull: false })
  status!: 'active' | 'inactive';

  @BelongsToMany(() => RoleModel, () => RoleUserModel)
  roles!: RoleModel[];

  @HasMany(() => RefreshTokenModel)
  refreshTokens!: RefreshTokenModel[];

  @BeforeCreate
  @BeforeUpdate
  static async hashUserPassword(instance: UserModel) {
    if (instance.changed('password')) {
      instance.password = await hashPassword(instance.password);
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static normalizeFields(instance: UserModel) {
    if (instance.username) instance.username = instance.username.trim().toLowerCase();
    if (instance.email) instance.email = instance.email.trim().toLowerCase();
  }
}