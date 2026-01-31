import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
  AllowNull, DeletedAt, HasMany
} from "sequelize-typescript";
import {BaseModel} from "../database/baseModelSequelize";
import User from "./User";

@Table({tableName: 'Company'})
class Company extends BaseModel<Company> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull
  @Column
  planId: number;

  @AllowNull
  @Column
  isMaster: boolean;

  @AllowNull
  @Column
  phone: string;

  @AllowNull
  @Column
  email: string;

  @AllowNull
  @Column
  document: string;

  @AllowNull
  @Column
  active: boolean;

  @AllowNull
  @Column
  dueDate: Date;

  @AllowNull
  @Column
  signature: string;

  @AllowNull
  @Column
  amount: number;

  @AllowNull
  @Column
  subdomain: string;

  @AllowNull
  @Column
  get logotipo(): string | null {
    if (this.getDataValue("logotipo")) {

      let value = this.getDataValue("logotipo");

      if(!value.includes('amazonaws')){
        return `${process.env.BACKEND_URL}/${this.getDataValue("logotipo")}`;
      }

      return null;
    }
    return null;
  }
  set logotipo(value: string | null) {
    this.setDataValue("logotipo", value);
  }

  @AllowNull
  @Column
  schedule: string;

  @AllowNull
  @Column
  contactWhatsapp: string;

  @AllowNull
  @Column
  contactEmail: string;

  @AllowNull
  @Column
  address: string;

  @AllowNull
  @Column
  siteTitle: string;

  @AllowNull
  @Column
  siteSubTitle: string;

  @AllowNull
  @Column
  colorPrimary: string;

  @AllowNull
  @Column
  colorSecondary: string;

  @AllowNull
  @Column
  isBtnWhatsapp: boolean;

  @AllowNull
  @Column
  isOrder: boolean;

  @AllowNull
  @Column
  isFrete: boolean;

  @AllowNull
  @Column
  chavePix: string;

  @AllowNull
  @DeletedAt
  @Column
  deletedAt: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;


  @HasMany(()=> User, {sourceKey: 'id', foreignKey: 'companyId'})
  users: User[];
}

export default Company;
