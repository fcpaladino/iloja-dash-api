import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("UserHistoric", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      companyId: {
        type: DataTypes.INTEGER,
        references: { model: "Company", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        allowNull: null
      },
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "User", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      action: {
        type: DataTypes.STRING,
        allowNull: true
      },
      entity: {
        type: DataTypes.STRING,
        allowNull: true
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      oldData: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      newData : {
        type: DataTypes.TEXT,
        allowNull: true,
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
    return queryInterface.dropTable("UserHistoric");
  }
};
