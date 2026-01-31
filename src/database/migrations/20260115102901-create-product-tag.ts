import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("ProductTag", {
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
      tagId:{
        type: DataTypes.INTEGER,
        references: { model: "Tag", key: "id" },
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
    return queryInterface.dropTable("ProductTag");
  }
};
