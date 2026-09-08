import {DataTypes, QueryInterface} from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn("Company", "categoryVisibleCount", {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 6,
    });
    await queryInterface.addColumn("Company", "recommendedVisibleCount", {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
    });
    await queryInterface.addColumn("Company", "promotionVisibleCount", {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
    });
    await queryInterface.addColumn("Category", "visibleCount", {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn("Category", "visibleCount");
    await queryInterface.removeColumn("Company", "promotionVisibleCount");
    await queryInterface.removeColumn("Company", "recommendedVisibleCount");
    await queryInterface.removeColumn("Company", "categoryVisibleCount");
  },
};
