import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("OrderStatus", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      orderId:{
        type: DataTypes.INTEGER,
        references: { model: "Order", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      statusId:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId:{
        type: DataTypes.INTEGER,
        references: { model: "User", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: true
      },
      note:{
        type: DataTypes.TEXT,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("OrderStatus");
  }
};
