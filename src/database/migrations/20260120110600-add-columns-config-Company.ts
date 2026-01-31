import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {

    return Promise.all([
      queryInterface.addColumn("Company", "subdomain", {
        type: DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Company", "logotipo", {
        type: DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Company", "schedule", {
        type: DataTypes.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn("Company", "contactWhatsapp", {
        type: DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Company", "contactEmail", {
        type: DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Company", "address", {
        type: DataTypes.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn("Company", "siteTitle", {
        type: DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Company", "siteSubTitle", {
        type: DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Company", "colorPrimary", {
        type: DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Company", "colorSecondary", {
        type: DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Company", "isBtnWhatsapp", {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      }),
      queryInterface.addColumn("Company", "isOrder", {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      }),
      queryInterface.addColumn("Company", "isFrete", {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }),
      queryInterface.addColumn("Company", "chavePix", {
        type: DataTypes.STRING,
        allowNull: true,
      }),
    ]);

  },

  down: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("Company", "subdomain"),
      queryInterface.removeColumn("Company", "logotipo"),
      queryInterface.removeColumn("Company", "schedule"),
      queryInterface.removeColumn("Company", "contactWhatsapp"),
      queryInterface.removeColumn("Company", "contactEmail"),
      queryInterface.removeColumn("Company", "address"),
      queryInterface.removeColumn("Company", "siteTitle"),
      queryInterface.removeColumn("Company", "siteSubTitle"),
      queryInterface.removeColumn("Company", "colorPrimary"),
      queryInterface.removeColumn("Company", "colorSecondary"),
      queryInterface.removeColumn("Company", "isBtnWhatsapp"),
      queryInterface.removeColumn("Company", "isOrder"),
      queryInterface.removeColumn("Company", "isFrete"),
      queryInterface.removeColumn("Company", "chavePix"),
    ]);
  }
};
