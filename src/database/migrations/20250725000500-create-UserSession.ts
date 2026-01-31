import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("UserSession", {
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
      uuid: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sessionId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      deviceInfo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true
      },
      userAgent: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isCurrent: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("UserSession");
  }
};
