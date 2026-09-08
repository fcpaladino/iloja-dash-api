import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn("People", "customerPortalAccess", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn("People", "phoneChangeNumber", { type: DataTypes.STRING, allowNull: true });
    await queryInterface.addColumn("People", "phoneChangeWaId", { type: DataTypes.STRING, allowNull: true });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn("People", "customerPortalAccess");
    await queryInterface.removeColumn("People", "phoneChangeWaId");
    await queryInterface.removeColumn("People", "phoneChangeNumber");
  },
};
