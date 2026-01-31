import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addIndex('UserSession', ['companyId'], {
      unique: false,
      name: 'idx_companyId',
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeIndex('UserSession', 'companyId');
  }
};
