import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.changeColumn("People", "customerPortalAccess", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.bulkUpdate("People", { customerPortalAccess: true }, {});
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.changeColumn("People", "customerPortalAccess", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },
};
