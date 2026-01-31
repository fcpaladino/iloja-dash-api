import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull, DeletedAt, BeforeCreate, BeforeUpdate, ForeignKey,
} from "sequelize-typescript";
import {BaseModel} from "../database/baseModelSequelize";
import {slugify} from "../helpers/slugify";
import Filter from "./Filter";

@Table({tableName: 'FilterItem'})
class FilterItem extends BaseModel<FilterItem> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Filter)
  @Column
  filterId: number;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull
  @Column
  slug: string;

  @AllowNull
  @Column
  order: number;

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
  static beforeCreateHook(instance: FilterItem) {
    if (instance.name) {
      instance.slug = slugify(instance.name);
    }
  }

  @BeforeUpdate
  static beforeUpdateHook(instance: FilterItem) {
    if (instance.changed("name")) {
      instance.slug = slugify(instance.name);
    }
  }
}

export default FilterItem;
