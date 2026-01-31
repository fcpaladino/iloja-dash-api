import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addIndex('User', ['username'], {
      unique: false,
      name: 'idx_username',
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeIndex('User', 'idx_username');
  }
};
