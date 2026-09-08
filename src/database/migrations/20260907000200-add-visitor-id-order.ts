import {DataTypes, QueryInterface} from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => queryInterface.addColumn("Order", "visitorId", {type: DataTypes.STRING(64), allowNull: true}),
  down: (queryInterface: QueryInterface) => queryInterface.removeColumn("Order", "visitorId")
};
