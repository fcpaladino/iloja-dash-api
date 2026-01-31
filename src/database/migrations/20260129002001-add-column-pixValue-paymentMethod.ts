import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {

    return Promise.all([
      queryInterface.addColumn("PaymentMethod", "pixValue", {
        type: DataTypes.STRING,
        allowNull: true,
      }),

    ]);

  },

  down: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("PaymentMethod", "pixValue"),
    ]);
  }
};
