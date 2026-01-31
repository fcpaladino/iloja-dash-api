import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("SubscriptionProduct", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      subscriptionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Subscription", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      planId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      value: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("SubscriptionProduct");
  }
};
