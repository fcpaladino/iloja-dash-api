import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("ProductFilterItem", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      productId:{
        type: DataTypes.INTEGER,
        references: { model: "Product", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      filterItemId:{
        type: DataTypes.INTEGER,
        references: { model: "FilterItem", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("ProductFilterItem");
  }
};
