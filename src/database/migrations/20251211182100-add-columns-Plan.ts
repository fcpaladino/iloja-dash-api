import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {

    return Promise.all([
      queryInterface.addColumn("Plan", "price", {
        type: DataTypes.DECIMAL,
        allowNull: true,
      }),
    ]);

  },

  down: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("Plan", "price"),
    ]);
  }
};
