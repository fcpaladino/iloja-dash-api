import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => queryInterface.addColumn("Product", "includeInMetaFeed", {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }),
  down: (queryInterface: QueryInterface) => queryInterface.removeColumn("Product", "includeInMetaFeed"),
};
