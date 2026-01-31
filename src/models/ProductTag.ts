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

@Table({tableName: 'ProductTag'})
class ProductTag extends BaseModel<ProductTag> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  productId: number;

  @AllowNull(false)
  @Column
  tagId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default ProductTag;
