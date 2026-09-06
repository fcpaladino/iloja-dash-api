import {DataTypes, QueryInterface} from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn("Company", "productCardType", {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: "right_square",
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn("Company", "productCardType");
  },
};
