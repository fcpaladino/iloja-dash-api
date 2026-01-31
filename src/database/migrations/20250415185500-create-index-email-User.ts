import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addIndex('User', ['email'], {
      unique: true,
      name: 'idx_email',
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeIndex('User', 'idx_email');
  }
};
