import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {

    return Promise.all([
      queryInterface.addColumn("PaymentMethod", "enabledChange", {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }),

    ]);

  },

  down: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("PaymentMethod", "enabledChange"),
    ]);
  }
};
