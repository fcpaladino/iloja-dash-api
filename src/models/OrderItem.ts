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
import {DataTypes} from "sequelize";

@Table({tableName: 'OrderItem'})
class OrderItem extends BaseModel<OrderItem> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  orderId: number;

  @AllowNull(false)
  @Column
  productId: number;

  @AllowNull
  @Column
  productName: string;

  @AllowNull
  @Column
  productRef: string;

  @AllowNull
  @Column
  quantity: number;

  @AllowNull
  @Column
  unitPrice: number;

  @AllowNull
  @Column
  totalPrice: number;

  @AllowNull
  @Column
  note: string;

  @AllowNull
  @Column(DataTypes.JSONB)
  extras: [];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

export default OrderItem;
