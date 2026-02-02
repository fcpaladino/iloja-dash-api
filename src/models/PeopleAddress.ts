import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull, DeletedAt, DataType,
} from "sequelize-typescript";

@Table({tableName: 'PeopleAddress'})
class PeopleAddress extends Model<PeopleAddress> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  peopleId: number;

  @AllowNull
  @Column
  internalCode: number;

  @AllowNull
  @Column
  type: number;
  // (enum: 'residencial', 'comercial', 'entrega', 'cobranca', etc.)

  @AllowNull
  @Column
  streetId: number;

  @AllowNull
  @Column
  address: string;

  @AllowNull
  @Column
  number: string;

  @AllowNull
  @Column
  complement: string;

  @AllowNull
  @Column
  district: string; // bairro

  @AllowNull
  @Column
  city: string; // cidade

  @AllowNull
  @Column
  state: string; // estado

  @AllowNull
  @Column
  zip: string; // cep

  @AllowNull
  @Column
  country: string; // país

  @AllowNull
  @Column
  isPrimary: boolean;

  @AllowNull
  @Column
  latitude: string;

  @AllowNull
  @Column
  longitude: string;

  @AllowNull
  @Column
  ibgeCode: string;

  @AllowNull
  @Column
  giaCode: string;

  @AllowNull
  @Column
  ddd: string;

  @AllowNull
  @Column
  siafiCode: string;

  @AllowNull
  @Column
  note: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

export default PeopleAddress;
