import {DataTypes, QueryInterface} from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn("People", "walletBalance", {type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0});
    await queryInterface.createTable("WalletTransaction", {
      id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
      companyId: {type: DataTypes.INTEGER, allowNull: false}, peopleId: {type: DataTypes.INTEGER, allowNull: false},
      orderId: {type: DataTypes.INTEGER, allowNull: true}, type: {type: DataTypes.STRING(30), allowNull: false},
      amount: {type: DataTypes.DECIMAL(12, 2), allowNull: false}, balanceBefore: {type: DataTypes.DECIMAL(12, 2), allowNull: false},
      balanceAfter: {type: DataTypes.DECIMAL(12, 2), allowNull: false}, metadata: {type: DataTypes.JSONB, allowNull: true},
      createdAt: {type: DataTypes.DATE, allowNull: false}, updatedAt: {type: DataTypes.DATE, allowNull: false},
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("WalletTransaction");
    await queryInterface.removeColumn("People", "walletBalance");
  },
};
