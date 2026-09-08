import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => queryInterface.createTable("Quote", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    companyId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Company", key: "id" }, onUpdate: "CASCADE", onDelete: "CASCADE" },
    peopleId: { type: DataTypes.INTEGER, allowNull: true, references: { model: "People", key: "id" }, onUpdate: "CASCADE", onDelete: "SET NULL" },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "DRAFT" },
    subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    discountValue: { type: DataTypes.DECIMAL(12, 2), allowNull: true, defaultValue: 0 },
    total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    validUntil: { type: DataTypes.DATE, allowNull: true },
    note: { type: DataTypes.TEXT, allowNull: true },
    items: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    emailSentAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
    deletedAt: { type: DataTypes.DATE, allowNull: true },
  }),
  down: (queryInterface: QueryInterface) => queryInterface.dropTable("Quote"),
};
