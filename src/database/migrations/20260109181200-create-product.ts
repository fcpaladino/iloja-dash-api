import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("Product", {
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
      categoryId:{
        type: DataTypes.INTEGER,
        references: { model: "Category", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      brandId:{
        type: DataTypes.INTEGER,
        references: { model: "Brand", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      groupId:{
        type: DataTypes.INTEGER,
        references: { model: "Group", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: true
      },
      subGroupId:{
        type: DataTypes.INTEGER,
        references: { model: "SubGroup", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: true
      },
      conditionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ref: {
        type: DataTypes.STRING,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: true
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      pricePromotional: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      availability: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      inventoryControl: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      stockCurrent: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      stockMin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      stockMax: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      dimensionUnit: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dimensionLenght: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      dimensionWidth: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      dimensionHeight: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      dimensionWeightUnit: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dimensionGrossWeight: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      dimensionTareWeight: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      dimensionNetWeight: {
        type: DataTypes.DECIMAL,
        allowNull: true
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
    return queryInterface.dropTable("Product");
  }
};
