import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn("People", "phoneCode", { type: DataTypes.STRING, allowNull: true });
    await queryInterface.addColumn("People", "phoneCodeExpiresAt", { type: DataTypes.DATE, allowNull: true });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn("People", "phoneCodeExpiresAt");
    await queryInterface.removeColumn("People", "phoneCode");
  },
};
