import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('Company', 'backgroundIconColor', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Company', 'backgroundIconOpacity', {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.6,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('Company', 'backgroundIconOpacity');
    await queryInterface.removeColumn('Company', 'backgroundIconColor');
  },
};
