import {DataTypes, QueryInterface} from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("AnalyticsEvent", "deviceId", {type: DataTypes.STRING(180), allowNull: true});
    await queryInterface.addColumn("AnalyticsEvent", "categoryId", {type: DataTypes.INTEGER, allowNull: true});
    await queryInterface.addIndex("AnalyticsEvent", ["companyId", "createdAt"], {name: "AnalyticsEvent_company_createdAt_idx"});
    await queryInterface.addIndex("AnalyticsEvent", ["companyId", "sessionId", "createdAt"], {name: "AnalyticsEvent_company_session_createdAt_idx"});
    await queryInterface.addIndex("AnalyticsEvent", ["companyId", "deviceId", "createdAt"], {name: "AnalyticsEvent_company_device_createdAt_idx"});
    await queryInterface.addIndex("AnalyticsEvent", ["companyId", "productId", "createdAt"], {name: "AnalyticsEvent_company_product_createdAt_idx"});
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeIndex("AnalyticsEvent", "AnalyticsEvent_company_product_createdAt_idx");
    await queryInterface.removeIndex("AnalyticsEvent", "AnalyticsEvent_company_device_createdAt_idx");
    await queryInterface.removeIndex("AnalyticsEvent", "AnalyticsEvent_company_session_createdAt_idx");
    await queryInterface.removeIndex("AnalyticsEvent", "AnalyticsEvent_company_createdAt_idx");
    await queryInterface.removeColumn("AnalyticsEvent", "categoryId");
    await queryInterface.removeColumn("AnalyticsEvent", "deviceId");
  }
};
