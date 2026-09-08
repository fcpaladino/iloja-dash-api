import {Table, Column, CreatedAt, PrimaryKey, AutoIncrement, AllowNull, DataType} from "sequelize-typescript";
import {BaseModel} from "../database/baseModelSequelize";

@Table({tableName: 'PointTransaction'})
class PointTransaction extends BaseModel<PointTransaction> {
  @PrimaryKey @AutoIncrement @Column id: number;
  @AllowNull(false) @Column companyId: number;
  @AllowNull(false) @Column peopleId: number;
  @AllowNull @Column orderId: number;
  @AllowNull(false) @Column type: string;
  @AllowNull(false) @Column points: number;
  @AllowNull(false) @Column balanceBefore: number;
  @AllowNull(false) @Column balanceAfter: number;
  @AllowNull @Column(DataType.JSONB) metadata: object;
  @CreatedAt createdAt: Date;
}

export default PointTransaction;
