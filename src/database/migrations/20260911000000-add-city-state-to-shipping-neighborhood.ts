import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('ShippingNeighborhood', 'city', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('ShippingNeighborhood', 'state', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('ShippingNeighborhood', 'state');
    await queryInterface.removeColumn('ShippingNeighborhood', 'city');
  },
};
