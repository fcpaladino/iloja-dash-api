import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.sequelize.transaction(async t => {
      const plan = await queryInterface.rawSelect('Plan', {
        where: { id: 1 },
        transaction: t,
      }, ['id']);

      if (!plan) {
        await queryInterface.bulkInsert(
          "Plan",
          [{
            id: 1,
            name: "Plano master",
            createdAt: new Date(),
            updatedAt: new Date()
          }],
          { transaction: t }
        );
      }

      const company = await queryInterface.rawSelect('Company', {
        where: { id: 1 },
        transaction: t,
      }, ['id']);

      if (!company) {
        await queryInterface.bulkInsert(
          "Company",
          [{
            id: 1,
            name: "Empresa Master",
            planId: 1,
            email: 'master@admin.com',
            isMaster: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }],
          { transaction: t }
        );
      }
    });
  },

  down: async (queryInterface: QueryInterface) => {
    return null;
  }
};
