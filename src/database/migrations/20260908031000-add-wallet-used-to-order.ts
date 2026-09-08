import {DataTypes, QueryInterface} from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn("Order", "walletUsed", {type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0});
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn("Order", "walletUsed");
  },
};
