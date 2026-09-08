import { DataTypes, QueryInterface } from "sequelize";

const stamp = { createdAt: { type: DataTypes.DATE, allowNull: false }, updatedAt: { type: DataTypes.DATE, allowNull: false }, deletedAt: { type: DataTypes.DATE, allowNull: true } };

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("ReceivableAccount", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      companyId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Company", key: "id" }, onDelete: "CASCADE" },
      peopleId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "People", key: "id" }, onDelete: "CASCADE" },
      orderId: { type: DataTypes.INTEGER, allowNull: true, references: { model: "Order", key: "id" }, onDelete: "SET NULL" },
      description: { type: DataTypes.STRING(160), allowNull: false },
      totalValue: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      paidValue: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "OPEN" },
      note: { type: DataTypes.TEXT, allowNull: true },
      ...stamp,
    });
    await queryInterface.createTable("ReceivableInstallment", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      accountId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "ReceivableAccount", key: "id" }, onDelete: "CASCADE" },
      number: { type: DataTypes.INTEGER, allowNull: false },
      value: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      dueDate: { type: DataTypes.DATE, allowNull: false },
      paidValue: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "OPEN" },
      paidAt: { type: DataTypes.DATE, allowNull: true },
      paymentMethodId: { type: DataTypes.INTEGER, allowNull: true, references: { model: "PaymentMethod", key: "id" }, onDelete: "SET NULL" },
      note: { type: DataTypes.TEXT, allowNull: true },
      ...stamp,
    });
    await queryInterface.createTable("CashMovement", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      companyId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Company", key: "id" }, onDelete: "CASCADE" },
      type: { type: DataTypes.STRING(30), allowNull: false },
      value: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: true, references: { model: "User", key: "id" }, onDelete: "SET NULL" },
      orderId: { type: DataTypes.INTEGER, allowNull: true, references: { model: "Order", key: "id" }, onDelete: "SET NULL" },
      installmentId: { type: DataTypes.INTEGER, allowNull: true, references: { model: "ReceivableInstallment", key: "id" }, onDelete: "SET NULL" },
      description: { type: DataTypes.STRING(120), allowNull: true },
      note: { type: DataTypes.TEXT, allowNull: true },
      ...stamp,
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("CashMovement");
    await queryInterface.dropTable("ReceivableInstallment");
    await queryInterface.dropTable("ReceivableAccount");
  },
};
