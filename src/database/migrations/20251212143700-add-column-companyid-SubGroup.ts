import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {

    return Promise.all([
      queryInterface.addColumn("SubGroup", "companyId", {
        type: DataTypes.INTEGER,
        allowNull: false,
      }),
    ]);

  },

  down: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("SubGroup", "companyId"),
    ]);
  }
};
