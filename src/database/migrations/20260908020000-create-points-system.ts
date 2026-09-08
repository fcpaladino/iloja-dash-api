import {DataTypes, QueryInterface} from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    for (const [table, column, definition] of [
      ["Company", "pointsEnabled", {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false}],
      ["Company", "pointValue", {type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 1}],
      ["Product", "allowPoints", {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true}],
      ["Product", "pointsEarn", {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0}],
      ["Product", "pointsCost", {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0}],
      ["Product", "pointsOnly", {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false}],
      ["Product", "pointsAndMoney", {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false}],
    ] as any) await queryInterface.addColumn(table, column, definition);

    await queryInterface.createTable("PointTransaction", {
      id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
      companyId: {type: DataTypes.INTEGER, allowNull: false}, peopleId: {type: DataTypes.INTEGER, allowNull: false},
      orderId: {type: DataTypes.INTEGER, allowNull: true}, type: {type: DataTypes.STRING(30), allowNull: false},
      points: {type: DataTypes.INTEGER, allowNull: false}, balanceBefore: {type: DataTypes.INTEGER, allowNull: false},
      balanceAfter: {type: DataTypes.INTEGER, allowNull: false}, metadata: {type: DataTypes.JSONB, allowNull: true},
      createdAt: {type: DataTypes.DATE, allowNull: false}, updatedAt: {type: DataTypes.DATE, allowNull: false},
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("PointTransaction");
    for (const [table, column] of [["Product", "pointsAndMoney"], ["Product", "pointsOnly"], ["Product", "pointsCost"], ["Product", "pointsEarn"], ["Product", "allowPoints"], ["Company", "pointValue"], ["Company", "pointsEnabled"]]) await queryInterface.removeColumn(table, column);
  },
};
