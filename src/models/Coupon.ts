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

@Table({tableName: 'Coupon'})
class Coupon extends BaseModel<Coupon> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  companyId: number;

  @AllowNull(false)
  @Column
  code: string;

  @AllowNull
  @Column
  type: string;

  @AllowNull
  @Column
  value: number;

  @AllowNull
  @Column
  minOrderValue: number;

  @AllowNull
  @Column
  maxDiscount: number;

  @AllowNull
  @Column
  startAt: Date;

  @AllowNull
  @Column
  endAt: Date;

  @AllowNull
  @Column
  usageLimit: number;

  @AllowNull
  @Column
  usageCount: number;

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

export default Coupon;
