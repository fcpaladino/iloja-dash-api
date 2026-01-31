import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addIndex('Company', ['name'], {
      unique: true,
      name: 'idx_name',
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeIndex('Company', 'idx_name');
  }
};
