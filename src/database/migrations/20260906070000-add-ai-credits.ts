import {DataTypes, QueryInterface} from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Company", "aiCredits", {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0});
    await queryInterface.createTable("CompanyAiCreditTransaction", {
      id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true}, companyId: {type: DataTypes.INTEGER, allowNull: false}, userId: {type: DataTypes.INTEGER},
      type: {type: DataTypes.STRING, allowNull: false}, amount: {type: DataTypes.INTEGER, allowNull: false}, balanceAfter: {type: DataTypes.INTEGER, allowNull: false},
      description: {type: DataTypes.STRING}, metadata: {type: DataTypes.JSONB}, createdAt: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW}
    });
    await queryInterface.createTable("AiCreditOrder", {
      id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true}, companyId: {type: DataTypes.INTEGER, allowNull: false}, userId: {type: DataTypes.INTEGER, allowNull: false},
      packageCode: {type: DataTypes.STRING, allowNull: false}, credits: {type: DataTypes.INTEGER, allowNull: false}, amount: {type: DataTypes.DECIMAL(10, 2), allowNull: false},
      status: {type: DataTypes.STRING, allowNull: false, defaultValue: "pending"}, externalId: {type: DataTypes.STRING}, checkoutUrl: {type: DataTypes.STRING}, payload: {type: DataTypes.JSONB},
      createdAt: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW}, updatedAt: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW}
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("AiCreditOrder"); await queryInterface.dropTable("CompanyAiCreditTransaction"); await queryInterface.removeColumn("Company", "aiCredits");
  }
};
