import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("Subscription", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Company", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      planId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      discount: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      totalValue: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      extraInfo: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: []
      },
      paymentType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      paymentId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      monthRef:{
        type: DataTypes.INTEGER,
        allowNull: true
      },
      yearRef:{
        type: DataTypes.INTEGER,
        allowNull: true
      },
      log:{
        type: DataTypes.JSONB,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
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
    return queryInterface.dropTable("Subscription");
  }
};
