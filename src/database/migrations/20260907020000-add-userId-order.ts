import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Order", "userId", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "User", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
    return queryInterface.addIndex("Order", ["userId"], { name: "idx_order_userId" });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeIndex("Order", "idx_order_userId");
    return queryInterface.removeColumn("Order", "userId");
  },
};
