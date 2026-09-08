import {DataTypes, QueryInterface} from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn("Company", "pointCashValue", {type: DataTypes.DECIMAL(12, 4), allowNull: false, defaultValue: 0.01});
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn("Company", "pointCashValue");
  },
};
