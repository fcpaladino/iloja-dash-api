import {DataTypes, QueryInterface} from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => queryInterface.createTable("ProductInteraction", {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false},
    companyId: {type: DataTypes.INTEGER, allowNull: false, references: {model: "Company", key: "id"}, onUpdate: "CASCADE", onDelete: "CASCADE"},
    productId: {type: DataTypes.INTEGER, allowNull: false, references: {model: "Product", key: "id"}, onUpdate: "CASCADE", onDelete: "CASCADE"},
    visitorId: {type: DataTypes.STRING(64), allowNull: true}, customerId: {type: DataTypes.INTEGER, allowNull: true},
    eventType: {type: DataTypes.ENUM("VIEW", "ENGAGED_VIEW", "INTEREST", "NOT_INTERESTED", "ADD_TO_CART", "PURCHASE"), allowNull: false},
    score: {type: DataTypes.INTEGER, allowNull: false}, metadata: {type: DataTypes.JSONB, allowNull: true},
    createdAt: {type: DataTypes.DATE, allowNull: false}, updatedAt: {type: DataTypes.DATE, allowNull: false}
  }).then(() => Promise.all([
    queryInterface.addIndex("ProductInteraction", ["companyId"], {name: "ProductInteraction_companyId_idx"}),
    queryInterface.addIndex("ProductInteraction", ["productId"], {name: "ProductInteraction_productId_idx"}),
    queryInterface.addIndex("ProductInteraction", ["visitorId"], {name: "ProductInteraction_visitorId_idx"}),
    queryInterface.addIndex("ProductInteraction", ["customerId"], {name: "ProductInteraction_customerId_idx"}),
    queryInterface.addIndex("ProductInteraction", ["eventType"], {name: "ProductInteraction_eventType_idx"}),
    queryInterface.addIndex("ProductInteraction", ["createdAt"], {name: "ProductInteraction_createdAt_idx"}),
    queryInterface.addIndex("ProductInteraction", ["companyId", "visitorId"], {name: "ProductInteraction_company_visitor_idx"}),
    queryInterface.addIndex("ProductInteraction", ["companyId", "visitorId", "productId"], {name: "ProductInteraction_company_visitor_product_idx"})
  ])),
  down: async (queryInterface: QueryInterface) => { await queryInterface.dropTable("ProductInteraction"); await queryInterface.sequelize.query("DROP TYPE IF EXISTS \"enum_ProductInteraction_eventType\";"); }
};
