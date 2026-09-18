import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ProductTypeModel } from '../../../../product-types/infrastructure/persistence/models/product-type.model.js';

@Table({ tableName: 'products', timestamps: true })
export class ProductModel extends Model {
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true })
  declare id: number;

  @Column({ type: DataType.STRING(150), allowNull: false, unique: true })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare price: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare stock: number;

  @ForeignKey(() => ProductTypeModel)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare productTypeId: number;

  @Column({ type: DataType.ENUM('active', 'inactive'), defaultValue: 'active' })
  declare status: string;
}
