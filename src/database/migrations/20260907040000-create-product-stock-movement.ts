import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => queryInterface.createTable("ProductStockMovement", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    companyId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Company", key: "id" }, onUpdate: "CASCADE", onDelete: "CASCADE" },
    productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Product", key: "id" }, onUpdate: "CASCADE", onDelete: "CASCADE" },
    userId: { type: DataTypes.INTEGER, allowNull: true, references: { model: "User", key: "id" }, onUpdate: "CASCADE", onDelete: "SET NULL" },
    quantityBefore: { type: DataTypes.DECIMAL(12, 3), allowNull: false },
    quantityAfter: { type: DataTypes.DECIMAL(12, 3), allowNull: false },
    quantityDelta: { type: DataTypes.DECIMAL(12, 3), allowNull: false },
    reason: { type: DataTypes.STRING(80), allowNull: false },
    note: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  }),
  down: (queryInterface: QueryInterface) => queryInterface.dropTable("ProductStockMovement"),
};
