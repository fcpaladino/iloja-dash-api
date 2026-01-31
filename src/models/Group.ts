import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull, DeletedAt, HasMany, BeforeCreate, BeforeUpdate,
} from "sequelize-typescript";
import {BaseModel} from "../database/baseModelSequelize";
import SubGroup from "./SubGroup";
import {slugify} from "../helpers/slugify";

@Table({tableName: 'Group'})
class Group extends BaseModel<Group> {
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

  @HasMany(()=>SubGroup, { foreignKey: "groupId", as: "subGroups" })
  subGroups: SubGroup[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @BeforeCreate
  static beforeCreateHook(instance: Group) {
    if (instance.name) {
      instance.slug = slugify(instance.name);
    }
  }

  @BeforeUpdate
  static beforeUpdateHook(instance: Group) {
    if (instance.changed("name")) {
      instance.slug = slugify(instance.name);
    }
  }
}

export default Group;
