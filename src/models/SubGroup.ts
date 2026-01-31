import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull, DeletedAt, ForeignKey, BeforeCreate, BeforeUpdate,
} from "sequelize-typescript";
import {BaseModel} from "../database/baseModelSequelize";
import Group from "./Group";
import {slugify} from "../helpers/slugify";

@Table({tableName: 'SubGroup'})
class SubGroup extends BaseModel<SubGroup> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  companyId: number;

  @ForeignKey(() => Group)
  @Column
  groupId: number;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  slug: string;

  @AllowNull
  @Column
  description: string;

  @AllowNull
  @Column
  color: string;

  @AllowNull
  @Column
  icon: string;

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
  static beforeCreateHook(instance: SubGroup) {
    if (instance.name) {
      instance.slug = slugify(instance.name);
    }
  }

  @BeforeUpdate
  static beforeUpdateHook(instance: SubGroup) {
    if (instance.changed("name")) {
      instance.slug = slugify(instance.name);
    }
  }
}

export default SubGroup;
