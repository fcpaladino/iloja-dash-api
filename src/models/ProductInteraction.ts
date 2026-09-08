import {AllowNull, AutoIncrement, BelongsTo, Column, CreatedAt, DataType, ForeignKey, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";
import {BaseModel} from "../database/baseModelSequelize";
import Company from "./Company";
import Product from "./Product";

export const PRODUCT_INTERACTION_EVENTS = ["VIEW", "ENGAGED_VIEW", "INTEREST", "NOT_INTERESTED", "ADD_TO_CART", "PURCHASE"] as const;
export type ProductInteractionEvent = typeof PRODUCT_INTERACTION_EVENTS[number];

@Table({tableName: "ProductInteraction"})
class ProductInteraction extends BaseModel<ProductInteraction> {
  @PrimaryKey @AutoIncrement @Column id: number;
  @ForeignKey(() => Company) @Column companyId: number;
  @ForeignKey(() => Product) @Column productId: number;
  @AllowNull @Column visitorId: string;
  @AllowNull @Column customerId: number;
  @Column(DataType.ENUM(...PRODUCT_INTERACTION_EVENTS)) eventType: ProductInteractionEvent;
  @Column(DataType.INTEGER) score: number;
  @AllowNull @Column(DataType.JSONB) metadata: any;
  @CreatedAt createdAt: Date;
  @UpdatedAt updatedAt: Date;

  @BelongsTo(() => Company) company: Company;
  @BelongsTo(() => Product) product: Product;
}

export default ProductInteraction;
