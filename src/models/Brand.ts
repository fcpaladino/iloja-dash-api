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

@Table({tableName: 'Brand'})
class Brand extends BaseModel<Brand> {
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

  @AllowNull(false)
  @Column
  slug: string;

  @AllowNull
  @Column
  active: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @BeforeCreate
  static beforeCreateHook(instance: Brand) {
    console.log('modal', instance.name, slugify(instance.name));
    if (instance.name) {
      instance.slug = slugify(instance.name);
    }
  }

  @BeforeUpdate
  static beforeUpdateHook(instance: Brand) {
    if (instance.changed("name")) {
      instance.slug = slugify(instance.name);
    }
  }
}

export default Brand;
