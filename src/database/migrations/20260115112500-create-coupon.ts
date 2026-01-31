import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("Coupon", {
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
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      type: {
        // PERCENT ou FIXED
        type: DataTypes.ENUM('percent', 'fixed'),
        allowNull: false,
      },
      value: {
        // percentual (ex: 10 = 10%) ou valor fixo
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      minOrderValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      maxDiscount: {
        // limite de desconto (útil pra PERCENT)
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      startAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      usageLimit: {
        // total de usos
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      usageCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("Coupon");
  }
};
