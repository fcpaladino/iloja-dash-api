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

@Table({tableName: 'Tag'})
class Tag extends BaseModel<Tag> {
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


  @BeforeCreate
  static beforeCreateHook(instance: Tag) {
    if (instance.name) {
      instance.slug = slugify(instance.name);
    }
  }

  @BeforeUpdate
  static beforeUpdateHook(instance: Tag) {
    if (instance.changed("name")) {
      instance.slug = slugify(instance.name);
    }
  }
}

export default Tag;
