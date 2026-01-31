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

@Table({tableName: 'ShippingNeighborhood'})
class ShippingNeighborhod extends BaseModel<ShippingNeighborhod> {
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
  price: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @BeforeCreate
  static beforeCreateHook(instance: ShippingNeighborhod) {
    if (instance.name) {
      instance.slug = slugify(instance.name);
    }
  }

  @BeforeUpdate
  static beforeUpdateHook(instance: ShippingNeighborhod) {
    if (instance.changed("name")) {
      instance.slug = slugify(instance.name);
    }
  }
}

export default ShippingNeighborhod;
