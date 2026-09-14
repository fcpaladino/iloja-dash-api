import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Company", "productActionMode", { type: DataTypes.STRING, allowNull: false, defaultValue: "checkout" });
    await queryInterface.createTable("ProductInterestLead", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      companyId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Company", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Product", key: "id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      name: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: true },
      message: { type: DataTypes.TEXT, allowNull: true },
      status: { type: DataTypes.STRING, allowNull: false, defaultValue: "NEW" },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("ProductInterestLead");
    await queryInterface.removeColumn("Company", "productActionMode");
  },
};
