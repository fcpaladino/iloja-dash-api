import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, DeletedAt, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";

@Table({ tableName: "ReceivableAccount" })
class ReceivableAccount extends Model<ReceivableAccount> {
  @PrimaryKey @AutoIncrement @Column id: number;
  @AllowNull(false) @Column companyId: number;
  @AllowNull(false) @Column peopleId: number;
  @AllowNull @Column orderId: number;
  @AllowNull(false) @Column description: string;
  @AllowNull(false) @Column(DataType.DECIMAL(12, 2)) totalValue: number;
  @AllowNull(false) @Column(DataType.DECIMAL(12, 2)) paidValue: number;
  @AllowNull(false) @Column status: string;
  @AllowNull @Column(DataType.TEXT) note: string;
  @CreatedAt createdAt: Date;
  @UpdatedAt updatedAt: Date;
  @DeletedAt deletedAt: Date;
}

export default ReceivableAccount;
