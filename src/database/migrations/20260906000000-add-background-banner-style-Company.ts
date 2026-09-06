import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface) => queryInterface.addColumn('Company', 'backgroundBannerStyle', {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'cart',
  }),

  down: (queryInterface: QueryInterface) => queryInterface.removeColumn('Company', 'backgroundBannerStyle'),
};
