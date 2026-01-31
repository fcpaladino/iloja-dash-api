import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {

    return Promise.all([
      queryInterface.addColumn("DeliveryType", "enableAddress", {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }),

    ]);

  },

  down: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("DeliveryType", "enableAddress"),
    ]);
  }
};
