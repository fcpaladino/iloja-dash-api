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

@Table({tableName: 'People'})
class People extends BaseModel<People> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  companyId: number;

  @AllowNull
  @Column
  internalCode: string;

  @AllowNull
  @Column
  personType: number; // PF=1 | PJ=2

  @AllowNull
  @Column
  typeId: number;
  //(enum: 'cliente', 'fornecedor', 'funcionario', 'usuario', etc.)

  @AllowNull
  @Column
  legalName: string;

  @AllowNull
  @Column
  tradeName: string;

  @AllowNull
  @Column
  stateRegistration: string;

  @AllowNull
  @Column
  municipalRegistration: string;

  @AllowNull
  @Column
  documentType: string;

  @AllowNull
  @Column
  documentNumber: string;

  @AllowNull
  @Column
  email: string;

  @AllowNull
  @Column
  phoneNumber: string;

  @AllowNull
  @Column
  phoneNumberAlt: string;

  @AllowNull
  @Column
  nationality: string;

  @AllowNull
  @Column
  maritalStatusId: string;
  // (ex: 'solteiro', 'casado', etc., opcional)

  @AllowNull
  @Column
  profilePicture: string;

  @AllowNull
  @Column
  genderId: number;
  // (enum: 'M', 'F', 'O', ou string livre)

  @AllowNull
  @Column
  dateOfBirth: Date;

  @AllowNull
  @Column
  waId: string;

  @AllowNull
  @Column
  note: string;

  @AllowNull
  @Column
  active: boolean;

  @AllowNull
  @Column
  point: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

export default People;
