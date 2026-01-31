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

@Table({tableName: 'OrderStatus'})
class OrderStatus extends BaseModel<OrderStatus> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  orderId: number;

  @AllowNull(false)
  @Column
  statusId: number;

  @AllowNull
  @Column
  userId: number;

  @AllowNull
  @Column
  note: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

export default OrderStatus;
