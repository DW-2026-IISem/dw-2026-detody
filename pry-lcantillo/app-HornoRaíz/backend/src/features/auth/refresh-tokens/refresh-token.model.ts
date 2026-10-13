import { RoleUserModel } from "../roles/dto/role-user.model";

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";


@Table({
  tableName: "refresh_tokens",
  timestamps: true,
})
export class RefreshTokenModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => RoleUserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id!: number;

  @Column({
    type: DataType.STRING(64),
    allowNull: false,
  })
  token_hash!: string;

  @Column({
    type: DataType.STRING(36),
    allowNull: false,
  })
  family_id!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  device_info!: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expires_at!: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  revoked!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => RoleUserModel)
  user!: RoleUserModel;
}
