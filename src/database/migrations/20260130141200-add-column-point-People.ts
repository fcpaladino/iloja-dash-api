import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {

    return Promise.all([
      queryInterface.addColumn("People", "point", {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      }),

    ]);

  },

  down: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("People", "point"),
    ]);
  }
};
