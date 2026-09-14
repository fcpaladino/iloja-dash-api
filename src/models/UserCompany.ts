import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  ForeignKey,
} from "sequelize-typescript";
import { BaseModel } from "../database/baseModelSequelize";
import User from "./User";
import Company from "./Company";
import Role from "./Role";

@Table({ tableName: "UserCompany" })
class UserCompany extends BaseModel<UserCompany> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @ForeignKey(() => Role)
  @AllowNull
  @Column
  roleId: number;

  @AllowNull(false)
  @Column({ defaultValue: false })
  owner: boolean;

  @AllowNull(false)
  @Column({ defaultValue: true })
  active: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default UserCompany;
