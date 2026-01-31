import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addColumn("SubGroup", "active", {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeColumn("SubGroup", "active");
  }
};
