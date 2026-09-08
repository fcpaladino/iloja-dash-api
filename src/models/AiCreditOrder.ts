import {AllowNull, AutoIncrement, Column, CreatedAt, DataType, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";
import {BaseModel} from "../database/baseModelSequelize";

@Table({tableName: "AiCreditOrder"})
class AiCreditOrder extends BaseModel<AiCreditOrder> {
  @PrimaryKey @AutoIncrement @Column id: number;
  @Column companyId: number;
  @Column userId: number;
  @Column packageCode: string;
  @Column credits: number;
  @Column(DataType.DECIMAL(10, 2)) amount: number;
  @Column status: string;
  @AllowNull @Column externalId: string;
  @AllowNull @Column checkoutUrl: string;
  @AllowNull @Column(DataType.JSONB) payload: Record<string, unknown>;
  @CreatedAt createdAt: Date;
  @UpdatedAt updatedAt: Date;
}

export default AiCreditOrder;
