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

@Table({tableName: 'DeliveryType'})
class DeliveryType extends BaseModel<DeliveryType> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  companyId: number;

  @AllowNull(false)
  @Column
  typeId: number;

  @AllowNull
  @Column
  name: string;

  @AllowNull
  @Column
  description: string;

  @AllowNull
  @Column
  hasShipping: boolean;

  @AllowNull
  @Column
  extraFee: number;

  @AllowNull
  @Column
  order: number;

  @AllowNull
  @Column
  active: boolean;

  @AllowNull
  @Column
  enableAddress: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

export default DeliveryType;
