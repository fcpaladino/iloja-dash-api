import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, DeletedAt, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";

@Table({ tableName: "ReceivableInstallment" })
class ReceivableInstallment extends Model<ReceivableInstallment> {
  @PrimaryKey @AutoIncrement @Column id: number;
  @AllowNull(false) @Column accountId: number;
  @AllowNull(false) @Column number: number;
  @AllowNull(false) @Column(DataType.DECIMAL(12, 2)) value: number;
  @AllowNull(false) @Column(DataType.DATE) dueDate: Date;
  @AllowNull(false) @Column(DataType.DECIMAL(12, 2)) paidValue: number;
  @AllowNull(false) @Column status: string;
  @AllowNull @Column(DataType.DATE) paidAt: Date;
  @AllowNull @Column paymentMethodId: number;
  @AllowNull @Column(DataType.TEXT) note: string;
  @CreatedAt createdAt: Date;
  @UpdatedAt updatedAt: Date;
  @DeletedAt deletedAt: Date;
}

export default ReceivableInstallment;
