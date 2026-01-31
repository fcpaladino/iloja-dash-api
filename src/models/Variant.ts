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

@Table({tableName: 'Variant'})
class Variant extends BaseModel<Variant> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  companyId: number;

  @AllowNull
  @Column
  registerModel: string;

  @AllowNull
  @Column
  registerId: number;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull
  @Column
  active: boolean;

  @AllowNull
  @Column
  requered: boolean;

  @AllowNull
  @Column
  min: number;

  @AllowNull
  @Column
  max: number;

  @AllowNull
  @Column
  order: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

export default Variant;
