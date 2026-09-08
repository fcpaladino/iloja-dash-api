import {AllowNull, AutoIncrement, Column, CreatedAt, DataType, PrimaryKey, Table} from "sequelize-typescript";
import {BaseModel} from "../database/baseModelSequelize";

@Table({tableName: "CompanyAiCreditTransaction", timestamps: true, updatedAt: false})
class CompanyAiCreditTransaction extends BaseModel<CompanyAiCreditTransaction> {
  @PrimaryKey @AutoIncrement @Column id: number;
  @Column companyId: number;
  @AllowNull @Column userId: number;
  @Column type: string;
  @Column amount: number;
  @Column balanceAfter: number;
  @AllowNull @Column description: string;
  @AllowNull @Column(DataType.JSONB) metadata: any;
  @CreatedAt createdAt: Date;
}

export default CompanyAiCreditTransaction;
