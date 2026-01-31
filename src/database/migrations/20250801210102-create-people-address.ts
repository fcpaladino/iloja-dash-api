import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("PeopleAddress", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      peopleId:{
        type: DataTypes.INTEGER,
        references: { model: "People", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      internalCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      streetId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      complement: {
        type: DataTypes.STRING,
        allowNull: true
      },
      district: {
        type: DataTypes.STRING,
        allowNull: true
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      zip: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isPrimary: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      latitude: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      geography: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ibgeCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      giaCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ddd: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      siafiCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      note: {
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
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("PeopleAddress");
  }
};
