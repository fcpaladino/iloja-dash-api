import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("Order", {
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
      peopleId:{
        type: DataTypes.INTEGER,
        references: { model: "People", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      paymentMethodId:{
        type: DataTypes.INTEGER,
        references: { model: "PaymentMethod", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: true
      },
      couponId:{
        type: DataTypes.INTEGER,
        references: { model: "Coupon", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: true
      },
      deliveryTypeId:{
        type: DataTypes.INTEGER,
        references: { model: "DeliveryType", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: true
      },
      statusId: {
        // PENDING | CONFIRMED | PREPARING | OUT_FOR_DELIVERY | COMPLETED | CANCELED
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      shippingValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      discountValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      paymentStatusId: {
        // PENDING | PAID | REFUNDED | FAILED
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      address: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: () => {
          return {
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: '',
          }
        }
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      },
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("Order");
  }
};
