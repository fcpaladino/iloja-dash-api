import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addIndex('UserSession', ['userId'], {
      unique: false,
      name: 'idx_userId',
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeIndex('UserSession', 'userId');
  }
};
