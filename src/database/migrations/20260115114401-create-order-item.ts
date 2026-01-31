import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("OrderItem", {
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
      productId:{
        type: DataTypes.INTEGER,
        references: { model: "Product", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productRef: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      extras: {
        // ex: adicionais/observações estruturadas
        // [{ id, name, qty, price }]
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
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
    return queryInterface.dropTable("OrderItem");
  }
};
