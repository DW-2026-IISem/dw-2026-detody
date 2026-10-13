import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UserModel } from './user.model';
import { RoleModel } from './role.model';

@Table({ tableName: 'role_users', timestamps: true })
export class RoleUserModel extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id!: number;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id!: number;

  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  role_id!: number;

  @Column({ type: DataType.ENUM('active', 'inactive'), defaultValue: 'active' })
  status!: 'active' | 'inactive';
}
