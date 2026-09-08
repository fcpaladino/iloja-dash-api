import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";

@Table({ tableName: "CashMovement" })
class CashMovement extends Model<CashMovement> {
  @PrimaryKey @AutoIncrement @Column id: number;
  @AllowNull(false) @Column companyId: number;
  @AllowNull(false) @Column(DataType.STRING(30)) type: string;
  @AllowNull(false) @Column(DataType.DECIMAL(12, 2)) value: number;
  @AllowNull @Column userId: number;
  @AllowNull @Column orderId: number;
  @AllowNull @Column installmentId: number;
  @AllowNull @Column(DataType.STRING(120)) description: string;
  @AllowNull @Column(DataType.TEXT) note: string;
  @CreatedAt createdAt: Date;
  @UpdatedAt updatedAt: Date;
}

export default CashMovement;
