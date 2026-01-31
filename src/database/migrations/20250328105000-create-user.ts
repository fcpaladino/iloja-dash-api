import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("User", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      companyId:{
        type: DataTypes.INTEGER,
        references: { model: "Company", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      roleId:{
        type: DataTypes.INTEGER,
        references: { model: "Role", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      emailVerifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      emailCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneVerifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      phoneCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is2fa: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      token2fa: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      loggedIn: {
        type: DataTypes.DATE,
        allowNull: true
      },
      owner: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      profilePicUrl: {
        type: DataTypes.STRING,
        defaultValue: true
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
      }
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("User");
  }
};
