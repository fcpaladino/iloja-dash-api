import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable("AnalyticsEvent", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      companyId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Company", key: "id" }, onDelete: "CASCADE" },
      event: { type: DataTypes.STRING(80), allowNull: false },
      productId: { type: DataTypes.STRING(120), allowNull: true },
      productName: { type: DataTypes.STRING(255), allowNull: true },
      categoryName: { type: DataTypes.STRING(255), allowNull: true },
      quantity: { type: DataTypes.DECIMAL, allowNull: true },
      value: { type: DataTypes.DECIMAL, allowNull: true },
      sessionId: { type: DataTypes.STRING(180), allowNull: true },
      metadata: { type: DataTypes.JSON, allowNull: true },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });
    await queryInterface.addIndex("AnalyticsEvent", ["companyId", "event", "createdAt"]);
    await queryInterface.addIndex("AnalyticsEvent", ["companyId", "productId"]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("AnalyticsEvent");
  },
};
