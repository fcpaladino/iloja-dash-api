import { Table, Column, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, AllowNull, DeletedAt, DataType } from "sequelize-typescript";
import { BaseModel } from "../database/baseModelSequelize";

@Table({ tableName: "ProductField" })
class ProductField extends BaseModel<ProductField> {
  @PrimaryKey @AutoIncrement @Column id: number;

  @AllowNull(false) @Column companyId: number;
  @AllowNull(false) @Column name: string;
  @AllowNull(false) @Column slug: string;
  @AllowNull(false) @Column type: string;
  @AllowNull @Column(DataType.JSONB) options: any;
  @AllowNull(false) @Column({ defaultValue: false }) isFilter: boolean;
  @AllowNull(false) @Column({ defaultValue: true }) active: boolean;
  @AllowNull(false) @Column({ defaultValue: 0 }) order: number;

  @CreatedAt createdAt: Date;
  @UpdatedAt updatedAt: Date;
  @DeletedAt deletedAt: Date;
}

export default ProductField;
