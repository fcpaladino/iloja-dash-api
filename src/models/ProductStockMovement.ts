import { AllowNull, AutoIncrement, Column, CreatedAt, PrimaryKey, Table, Model, UpdatedAt } from "sequelize-typescript";
import { DataTypes } from "sequelize";

@Table({ tableName: "ProductStockMovement" })
class ProductStockMovement extends Model<ProductStockMovement> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  companyId: number;

  @AllowNull(false)
  @Column
  productId: number;

  @AllowNull
  @Column
  userId: number;

  @AllowNull(false)
  @Column
  quantityBefore: number;

  @AllowNull(false)
  @Column
  quantityAfter: number;

  @AllowNull(false)
  @Column
  quantityDelta: number;

  @AllowNull(false)
  @Column
  reason: string;

  @AllowNull
  @Column(DataTypes.TEXT)
  note: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default ProductStockMovement;
