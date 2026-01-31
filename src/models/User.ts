import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
  AllowNull, DeletedAt, BeforeUpdate, BeforeCreate, DataType,
} from "sequelize-typescript";
import { hash, compare } from "bcryptjs";
import {BaseModel} from "../database/baseModelSequelize";

@Table({tableName: 'User'})
class User extends BaseModel<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  companyId: number;

  @AllowNull
  @Column
  roleId: number;

  @AllowNull
  @Column
  name: string;

  @AllowNull
  @Column
  username: string;

  @AllowNull
  @Column
  email: string;

  @AllowNull
  @Column
  emailVerifiedAt: Date;

  @AllowNull
  @Column
  emailCode: string;

  @AllowNull
  @Column
  phone: string;

  @AllowNull
  @Column
  phoneVerifiedAt: Date;

  @AllowNull
  @Column
  phoneCode: string;

  @AllowNull
  @Column
  token2fa: string;

  @AllowNull
  @Column
  is2fa: boolean;

  @AllowNull
  @Column
  get profilePicUrl(): string | null {
    if (this.getDataValue("profilePicUrl")) {

      let value = this.getDataValue("profilePicUrl");

      if(!value.includes('amazonaws')){
        return `${process.env.BACKEND_URL}/${this.getDataValue("profilePicUrl")}`;
      }

      return null;
    }
    return null;
  }
  set profilePicUrl(value: string | null) {
    this.setDataValue("profilePicUrl", value);
  }

  @Column(DataType.VIRTUAL)
  password: string;

  @Column
  passwordHash: string;

  @Column
  loggedIn: Date;

  @AllowNull
  @Column
  owner: boolean;

  @AllowNull
  @Column
  active: boolean;

  @AllowNull
  @Column
  passwordChange: boolean;

  @AllowNull
  @DeletedAt
  @Column
  deletedAt: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;


  @BeforeUpdate
  @BeforeCreate
  static hashPassword = async (instance: User): Promise<void> => {
    if (instance.password) {
      instance.passwordHash = await hash(instance.password, 8);
    }
  };

  public checkPassword = async (password: string): Promise<boolean> => {
    return compare(password, this.getDataValue("passwordHash"));
  };

}

export default User;
