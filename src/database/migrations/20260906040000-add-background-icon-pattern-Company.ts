import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface) => queryInterface.addColumn('Company', 'backgroundIconPattern', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'mercado',
  }),

  down: (queryInterface: QueryInterface) => queryInterface.removeColumn('Company', 'backgroundIconPattern'),
};
