import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Product", "customFields", {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    });

    await queryInterface.createTable("ProductField", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      companyId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Company", key: "id" }, onUpdate: "CASCADE", onDelete: "CASCADE" },
      name: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false, defaultValue: "text" },
      options: { type: DataTypes.JSONB, allowNull: true },
      isFilter: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    });

    await queryInterface.addIndex("ProductField", ["companyId", "slug"], { unique: true, name: "product_field_company_slug_unique" });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeIndex("ProductField", "product_field_company_slug_unique");
    await queryInterface.dropTable("ProductField");
    await queryInterface.removeColumn("Product", "customFields");
  },
};
