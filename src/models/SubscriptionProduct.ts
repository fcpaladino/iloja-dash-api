import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement, ForeignKey,
} from "sequelize-typescript";
import Subscription from "./Subscription";
import Plan from "./Plan";

@Table({tableName: 'SubscriptionProduct'})
class SubscriptionProduct extends Model<SubscriptionProduct> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  @ForeignKey(() => Subscription)
  subscriptionId: number;

  @Column
  @ForeignKey(() => Plan)
  planId: number;

  @Column
  productId: number;

  @Column
  value: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

}

export default SubscriptionProduct;
