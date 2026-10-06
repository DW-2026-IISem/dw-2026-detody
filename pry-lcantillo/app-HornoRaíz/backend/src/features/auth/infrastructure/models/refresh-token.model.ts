// src/features/auth/infrastructure/models/refresh-token.model.ts
import { Table, Column, Model, DataType, ForeignKey, Unique, BelongsTo } from 'sequelize-typescript';
import { UserModel } from './user.model';

@Table({ tableName: 'refresh_tokens', timestamps: true })
export class RefreshTokenModel extends Model {
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id!: number;

  @Unique('uq_refresh_tokens_token_hash')
  @Column({ type: DataType.STRING(255), allowNull: false })
  token_hash!: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  family_id!: string;

  @Column({ type: DataType.STRING(500), allowNull: true })
  device_info?: string;

  @Column({ type: DataType.DATE, allowNull: false })
  expires_at!: Date;

  // Los tokens nacen activos por defecto
  @Column({ type: DataType.ENUM('active', 'inactive'), defaultValue: 'active', allowNull: false })
  status!: 'active' | 'inactive';

  @BelongsTo(() => UserModel)
  user!: UserModel;
}