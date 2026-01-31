import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {

    return Promise.all([
      queryInterface.addColumn("Order", "changeValue", {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
      }),

    ]);

  },

  down: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("Order", "changeValue"),
    ]);
  }
};
