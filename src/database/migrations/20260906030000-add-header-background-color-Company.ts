import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface) => queryInterface.addColumn('Company', 'headerBackgroundColor', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#242424',
  }),

  down: (queryInterface: QueryInterface) => queryInterface.removeColumn('Company', 'headerBackgroundColor'),
};
