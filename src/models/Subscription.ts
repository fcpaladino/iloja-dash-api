import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasMany, ForeignKey, BelongsTo, AllowNull
} from "sequelize-typescript";
import SubscriptionProduct from "./SubscriptionProduct";
import Company from "./Company";

@Table({tableName: 'Subscription'})
class Subscription extends Model<Subscription> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @Column
  description: string;

  @Column
  dueDate: Date;

  @Column
  paymentDate: Date;

  @Column
  discount: number;

  @Column
  totalValue: number;

  @Column({
    type: DataType.JSONB
  })
  extraInfo: {};

  @Column
  paymentType: string;

  @Column
  status: string;


  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => SubscriptionProduct)
  products: SubscriptionProduct[];

  @Column
  planId: number;

  @Column
  monthRef: number;

  @Column
  yearRef: number;

  @AllowNull
  @Column
  paymentId: string;

  @AllowNull
  @Column({
    type: DataType.JSONB
  })
  log: [];
}

export default Subscription;
