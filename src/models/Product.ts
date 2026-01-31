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

@Table({tableName: 'Product'})
class Product extends BaseModel<Product> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  companyId: number;

  @AllowNull(false)
  @Column
  categoryId: number;

  @AllowNull(false)
  @Column
  brandId: number;

  @AllowNull
  @Column
  groupId: number;

  @AllowNull
  @Column
  subGroupId: number;

  @AllowNull
  @Column
  conditionId: number;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull
  @Column
  title: string;

  @AllowNull
  @Column
  sku: string;

  @AllowNull
  @Column
  ref: string;

  @AllowNull
  @Column
  description: string;

  @AllowNull
  @Column
  text: string;

  @AllowNull
  @Column
  slug: string;

  @AllowNull
  @Column
  get image(): string | null {
    if (this.getDataValue("image")) {

      let value = this.getDataValue("image");

      if(!value.includes('amazonaws')){
        return `${process.env.BACKEND_URL}/${this.getDataValue("image")}`;
      }

      return null;
    }
    return null;
  }
  set image(value: string | null) {
    this.setDataValue("image", value);
  }
  // image: string;

  @AllowNull
  @Column
  price: number;

  @AllowNull
  @Column
  pricePromotional: number;

  @AllowNull
  @Column
  availability: boolean;

  @AllowNull
  @Column
  active: boolean;

  @AllowNull
  @Column
  inventoryControl: boolean;

  @AllowNull
  @Column
  stockCurrent: number;

  @AllowNull
  @Column
  stockMin: number;

  @AllowNull
  @Column
  stockMax: number;

  @AllowNull
  @Column
  dimensionUnit: string;

  @AllowNull
  @Column
  dimensionLenght: number;

  @AllowNull
  @Column
  dimensionWidth: number;

  @AllowNull
  @Column
  dimensionHeight: number;

  @AllowNull
  @Column
  dimensionWeightUnit: string;

  @AllowNull
  @Column
  dimensionGrossWeight: number;

  @AllowNull
  @Column
  dimensionTareWeight: number;

  @AllowNull
  @Column
  dimensionNetWeight: number;

  @AllowNull
  @Column
  point: number;

  @AllowNull
  @Column
  isPromotional: boolean;

  @AllowNull
  @Column
  isNew: boolean;

  @AllowNull
  @Column
  isPopular: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

export default Product;
