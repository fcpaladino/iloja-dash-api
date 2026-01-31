import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("UserDepartament", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      departamentId:{
        type: DataTypes.INTEGER,
        references: { model: "Departament", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      userId:{
        type: DataTypes.INTEGER,
        references: { model: "User", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
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
    return queryInterface.dropTable("UserDepartament");
  }
};
