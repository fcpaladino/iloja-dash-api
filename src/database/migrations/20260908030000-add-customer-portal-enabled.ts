import {DataTypes, QueryInterface} from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn("Company", "customerPortalEnabled", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn("Company", "customerPortalEnabled");
  },
};
