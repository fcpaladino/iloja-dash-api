import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull, DeletedAt,
} from "sequelize-typescript";
import {BaseModel} from "../database/baseModelSequelize";

@Table({tableName: 'ProductFilterItem'})
class ProductFilterItem extends BaseModel<ProductFilterItem> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  productId: number;

  @AllowNull(false)
  @Column
  filterItemId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default ProductFilterItem;
