import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addIndex('UserSession', ['uuid'], {
      unique: true,
      name: 'idx_uuid',
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeIndex('UserSession', 'idx_uuid');
  }
};
