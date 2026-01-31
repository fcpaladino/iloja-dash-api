import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
  AllowNull, DataType,
} from "sequelize-typescript";
import {BaseModel} from "../database/baseModelSequelize";

@Table({tableName: 'Role'})
class Role extends BaseModel<Role> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull
  @Column
  description: string;

  @AllowNull
  @Column
  permissions: string;

  @AllowNull
  @Column
  companyId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Role;
