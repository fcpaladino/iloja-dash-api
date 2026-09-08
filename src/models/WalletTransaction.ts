import {AllowNull, Column, CreatedAt, DataType, Model, Table, UpdatedAt} from "sequelize-typescript";

@Table({tableName: "WalletTransaction"})
class WalletTransaction extends Model<WalletTransaction> {
  @Column({primaryKey: true, autoIncrement: true}) id: number;
  @AllowNull(false) @Column companyId: number;
  @AllowNull(false) @Column peopleId: number;
  @AllowNull @Column orderId: number;
  @AllowNull(false) @Column type: string;
  @AllowNull(false) @Column({type: DataType.DECIMAL(12, 2)}) amount: number;
  @AllowNull(false) @Column({type: DataType.DECIMAL(12, 2)}) balanceBefore: number;
  @AllowNull(false) @Column({type: DataType.DECIMAL(12, 2)}) balanceAfter: number;
  @AllowNull @Column({type: DataType.JSONB}) metadata: object;
  @CreatedAt createdAt: Date;
  @UpdatedAt updatedAt: Date;
}

export default WalletTransaction;
