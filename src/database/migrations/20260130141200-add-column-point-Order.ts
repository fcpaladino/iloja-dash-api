import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {

    return Promise.all([
      queryInterface.addColumn("Order", "pointGenerated", {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      }),
      queryInterface.addColumn("Order", "pointUsed", {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      }),

    ]);

  },

  down: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("Order", "pointGenerated"),
      queryInterface.removeColumn("Order", "pointUsed"),
    ]);
  }
};
