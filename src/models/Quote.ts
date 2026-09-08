import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

@Table({ tableName: "Quote" })
class Quote extends Model<Quote> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  companyId: number;

  @AllowNull
  @Column
  peopleId: number;

  @AllowNull(false)
  @Column
  status: string;

  @AllowNull(false)
  @Column
  subtotal: number;

  @AllowNull
  @Column
  discountValue: number;

  @AllowNull(false)
  @Column
  total: number;

  @AllowNull
  @Column
  validUntil: Date;

  @AllowNull
  @Column(DataType.TEXT)
  note: string;

  @AllowNull
  @Column(DataType.JSONB)
  items: unknown[];

  @AllowNull
  @Column
  emailSentAt: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

export default Quote;
