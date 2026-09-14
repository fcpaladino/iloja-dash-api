import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("UserCompany", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "User", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Company", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Role", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      owner: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });

    await queryInterface.addConstraint("UserCompany", {
      fields: ["userId", "companyId"],
      type: "unique",
      name: "uq_user_company_user_company",
    });

    await queryInterface.sequelize.query(`
      INSERT INTO "UserCompany" ("userId", "companyId", "roleId", "owner", "active", "createdAt", "updatedAt")
      SELECT "id", "companyId", "roleId", COALESCE("owner", false), COALESCE("active", true), NOW(), NOW()
      FROM "User"
      WHERE "companyId" IS NOT NULL AND "deletedAt" IS NULL
    `);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("UserCompany");
  },
};
