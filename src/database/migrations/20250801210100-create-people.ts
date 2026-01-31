import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("People", {
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
      internalCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      personType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      legalName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tradeName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      stateRegistration: {
        type: DataTypes.STRING,
        allowNull: true
      },
      municipalRegistration: {
        type: DataTypes.STRING,
        allowNull: true
      },
      documentType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      documentNumber: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumberAlt: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nationality: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      maritalStatusId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      genderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    return queryInterface.dropTable("People");
  }
};
