import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, ForeignKey, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { BaseModel } from "../database/baseModelSequelize";
import Company from "./Company";
import Product from "./Product";

@Table({ tableName: "ProductInterestLead" })
class ProductInterestLead extends BaseModel<ProductInterestLead> {
  @PrimaryKey @AutoIncrement @Column id: number;
  @ForeignKey(() => Company) @Column companyId: number;
  @ForeignKey(() => Product) @Column productId: number;
  @AllowNull(false) @Column name: string;
  @AllowNull(false) @Column phone: string;
  @AllowNull @Column email: string;
  @AllowNull @Column message: string;
  @AllowNull @Column(DataType.STRING) status: string;
  @CreatedAt createdAt: Date;
  @UpdatedAt updatedAt: Date;
}

export default ProductInterestLead;
