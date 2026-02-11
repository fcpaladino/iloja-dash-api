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

@Table({tableName: 'PasswordRecovery'})
class PasswordRecovery extends Model<PasswordRecovery> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  email: string;

  @AllowNull(false)
  @Column
  token: string;

  @AllowNull(true)
  @Column
  code: string;

  @AllowNull
  @Column
  validIn: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default PasswordRecovery;
