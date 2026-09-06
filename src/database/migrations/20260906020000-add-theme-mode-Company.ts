import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('Company', 'themeMode', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'dark',
    });

    await queryInterface.addColumn('Company', 'darkBackground', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '#202124',
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('Company', 'darkBackground');
    await queryInterface.removeColumn('Company', 'themeMode');
  },
};
