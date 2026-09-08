import {AllowNull, AutoIncrement, BelongsTo, Column, CreatedAt, ForeignKey, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";
import {BaseModel} from "../database/baseModelSequelize";
import Company from "./Company";
import Product from "./Product";

@Table({tableName: "ProductPreference"})
class ProductPreference extends BaseModel<ProductPreference> {
  @PrimaryKey @AutoIncrement @Column id: number;
  @ForeignKey(() => Company) @Column companyId: number;
  @ForeignKey(() => Product) @Column productId: number;
  @AllowNull @Column visitorId: string;
  @AllowNull @Column customerId: number;
  @Column preference: "INTEREST" | "NOT_INTERESTED";
  @CreatedAt createdAt: Date;
  @UpdatedAt updatedAt: Date;

  @BelongsTo(() => Company) company: Company;
  @BelongsTo(() => Product) product: Product;
}

export default ProductPreference;
