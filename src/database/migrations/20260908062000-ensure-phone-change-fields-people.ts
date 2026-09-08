import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    const table = await queryInterface.describeTable("People");
    if (!table.phoneChangeNumber) await queryInterface.addColumn("People", "phoneChangeNumber", { type: DataTypes.STRING, allowNull: true });
    if (!table.phoneChangeWaId) await queryInterface.addColumn("People", "phoneChangeWaId", { type: DataTypes.STRING, allowNull: true });
  },
  async down(queryInterface: QueryInterface) {
    const table = await queryInterface.describeTable("People");
    if (table.phoneChangeWaId) await queryInterface.removeColumn("People", "phoneChangeWaId");
    if (table.phoneChangeNumber) await queryInterface.removeColumn("People", "phoneChangeNumber");
  },
};
