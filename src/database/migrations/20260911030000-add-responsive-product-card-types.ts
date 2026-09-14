import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Company", "productCardTypeMobile", {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "grid",
    });
    await queryInterface.addColumn("Company", "productCardTypeDesktop", {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "right_square",
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Company", "productCardTypeMobile");
    await queryInterface.removeColumn("Company", "productCardTypeDesktop");
  },
};
