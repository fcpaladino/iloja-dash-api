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

@Table({tableName: 'Order'})
class Order extends BaseModel<Order> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  companyId: number;

  @AllowNull(false)
  @Column
  peopleId: number;

  @AllowNull
  @Column
  paymentMethodId: number;

  @AllowNull
  @Column
  couponId: number;

  @AllowNull
  @Column
  deliveryTypeId: number;

  @AllowNull
  @Column
  statusId: number;

  @AllowNull
  @Column
  subtotal: number;

  @AllowNull
  @Column
  shippingValue: number;

  @AllowNull
  @Column
  discountValue: number;

  @AllowNull
  @Column
  total: number;

  @AllowNull
  @Column
  paymentStatusId: number;

  @AllowNull
  @Column(DataTypes.JSONB)
  address: {};

  @AllowNull
  @Column
  note: string;

  @AllowNull
  @Column
  changeValue: number;

  @AllowNull
  @Column
  pointGenerated: number;

  @AllowNull
  @Column
  pointUsed: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

export default Order;
