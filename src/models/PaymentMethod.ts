import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull, DeletedAt, BeforeCreate, BeforeUpdate,
} from "sequelize-typescript";
import {BaseModel} from "../database/baseModelSequelize";
import {slugify} from "../helpers/slugify";

@Table({tableName: 'PaymentMethod'})
class PaymentMethod extends BaseModel<PaymentMethod> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  companyId: number;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull
  @Column
  slug: string;

  @AllowNull
  @Column
  isDefault: boolean;

  @AllowNull
  @Column
  order: number;

  @AllowNull
  @Column
  active: boolean;

  @AllowNull
  @Column
  enabledChange: boolean;

  @AllowNull
  @Column
  pixValue: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @BeforeCreate
  static beforeCreateHook(instance: PaymentMethod) {
    if (instance.name) {
      instance.slug = slugify(instance.name);
    }
  }

  @BeforeUpdate
  static beforeUpdateHook(instance: PaymentMethod) {
    if (instance.changed("name")) {
      instance.slug = slugify(instance.name);
    }
  }
}

export default PaymentMethod;
