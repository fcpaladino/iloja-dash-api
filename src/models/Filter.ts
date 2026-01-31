import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull, DeletedAt, BeforeCreate, BeforeUpdate, HasMany,
} from "sequelize-typescript";
import {BaseModel} from "../database/baseModelSequelize";
import {slugify} from "../helpers/slugify";
import FilterItem from "./FilterItem";

@Table({tableName: 'Filter'})
class Filter extends BaseModel<Filter> {
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

  @HasMany(()=>FilterItem, { foreignKey: "filterId", as: "filterItems" })
  filterItems!: FilterItem[];

  @BeforeCreate
  static beforeCreateHook(instance: Filter) {
    if (instance.name) {
      instance.slug = slugify(instance.name);
    }
  }

  @BeforeUpdate
  static beforeUpdateHook(instance: Filter) {
    if (instance.changed("name")) {
      instance.slug = slugify(instance.name);
    }
  }
}

export default Filter;
