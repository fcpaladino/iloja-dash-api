import {DataTypes, QueryInterface} from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => queryInterface.createTable("ProductPreference", {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false},
    companyId: {type: DataTypes.INTEGER, allowNull: false, references: {model: "Company", key: "id"}, onUpdate: "CASCADE", onDelete: "CASCADE"},
    productId: {type: DataTypes.INTEGER, allowNull: false, references: {model: "Product", key: "id"}, onUpdate: "CASCADE", onDelete: "CASCADE"},
    visitorId: {type: DataTypes.STRING(64), allowNull: true}, customerId: {type: DataTypes.INTEGER, allowNull: true},
    preference: {type: DataTypes.ENUM("INTEREST", "NOT_INTERESTED"), allowNull: false},
    createdAt: {type: DataTypes.DATE, allowNull: false}, updatedAt: {type: DataTypes.DATE, allowNull: false}
  }).then(() => queryInterface.addConstraint("ProductPreference", {fields: ["companyId", "visitorId", "productId"], type: "unique", name: "ProductPreference_company_visitor_product_unique"})),
  down: async (queryInterface: QueryInterface) => { await queryInterface.dropTable("ProductPreference"); await queryInterface.sequelize.query("DROP TYPE IF EXISTS \"enum_ProductPreference_preference\";"); }
};
