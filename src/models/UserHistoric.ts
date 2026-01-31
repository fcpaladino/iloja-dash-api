import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  BelongsTo,
  ForeignKey, HasMany
} from "sequelize-typescript";
import Company from "./Company";
import User from "./User";
import {BaseModel} from "../database/baseModelSequelize";


@Table({tableName: 'UserHistoric'})
class UserHistoric extends BaseModel<UserHistoric> {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @AllowNull(false)
  @Column
  action: string;

  @AllowNull
  @Column
  entity: string;

  @AllowNull
  @Column
  entityId: number;

  @AllowNull
  @Column
  description: string;

  @AllowNull
  @Column
  oldData: string;

  @AllowNull
  @Column
  newData: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

}

export default UserHistoric;
