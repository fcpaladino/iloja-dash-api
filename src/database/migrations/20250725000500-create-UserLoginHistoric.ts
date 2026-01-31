import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("UserLoginHistoric", {
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
        onDelete: "CASCADE"
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: true
      },
      nav: {
        type: DataTypes.STRING,
        allowNull: true
      },
      os: {
        type: DataTypes.STRING,
        allowNull: true
      },
      mobile: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
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
    return queryInterface.dropTable("UserLoginHistoric");
  }
};
