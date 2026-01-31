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

@Table({tableName: 'VariantItem'})
class VariantItem extends BaseModel<VariantItem> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  variantId: number;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull
  @Column
  description: string;

  @AllowNull
  @Column
  price: number;

  @AllowNull
  @Column
  order: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default VariantItem;
