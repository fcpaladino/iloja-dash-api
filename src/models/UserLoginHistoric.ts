import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
} from "sequelize-typescript";

@Table({tableName: 'UserLoginHistoric'})
class UserLoginHistoric extends Model<UserLoginHistoric> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  companyId: number;

  @Column
  userId: number;

  @AllowNull(false)
  @Column
  status: string;

  @AllowNull(false)
  @Column
  ip: string;

  @AllowNull
  @Column
  nav: string;

  @AllowNull
  @Column
  os: string;

  @AllowNull
  @Column
  mobile: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default UserLoginHistoric;
