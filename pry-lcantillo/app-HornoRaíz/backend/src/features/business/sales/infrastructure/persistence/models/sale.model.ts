import { Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { ClientModel } from '../../../../clients/infrastructure/persistence/models/client.model.js';
import { SaleItemModel } from './sale-item.model.js';

@Table({ tableName: 'sales', timestamps: true })
export class SaleModel extends Model {
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true })
  declare id: number;

  @ForeignKey(() => ClientModel)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare clientId: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare totalAmount: number;

  @Column({ type: DataType.ENUM('completed', 'cancelled'), defaultValue: 'completed' })
  declare status: string;

  @HasMany(() => SaleItemModel)
  declare items: SaleItemModel[];
}
