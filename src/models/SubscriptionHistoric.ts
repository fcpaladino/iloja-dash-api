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

@Table({tableName: 'SubscriptionHistoric'})
class SubscriptionHistoric extends Model<SubscriptionHistoric> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  @ForeignKey(() => Subscription)
  subscriptionId: number;

  @Column
  description: string;

  @Column
  status: string;

  @Column
  userId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

}

export default SubscriptionHistoric;
