import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {

    return Promise.all([
      queryInterface.addColumn("SubGroup", "slug", {
        type: DataTypes.STRING,
        allowNull: true,
      }),

    ]);

  },

  down: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("SubGroup", "slug"),
    ]);
  }
};
