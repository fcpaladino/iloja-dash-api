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

@Table({tableName: 'ProductImage'})
class ProductImage extends BaseModel<ProductImage> {
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
  name: string;

  @AllowNull
  @Column
  caption: string;

  @AllowNull
  @Column
  url: string;

  @AllowNull
  @Column
  size: number;

  @AllowNull
  @Column
  width: number;

  @AllowNull
  @Column
  height: number;

  @AllowNull
  @Column
  mimetype: string;

  @AllowNull
  @Column
  order: number;

  @AllowNull
  @Column
  isDefault: boolean;

  @AllowNull
  @Column
  active: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

export default ProductImage;
