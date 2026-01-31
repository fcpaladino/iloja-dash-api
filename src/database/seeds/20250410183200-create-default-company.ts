import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.sequelize.transaction(t => {

      let promises = [];
      (async () => {

        promises.push(queryInterface.bulkInsert(
          "Plan",
          [
            {
              id: 1,
              name: "Plano master",
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ],
          { transaction: t }
        ));

        promises.push(queryInterface.bulkInsert(
          "Company",
          [
            {
              id: 1,
              name: "Empresa Master",
              planId: 1,
              email: 'master@admin.com',
              isMaster: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ],
          { transaction: t }
        ));
      })();

      if (promises.length) {
        return Promise.all(promises);
      }

      return null;

    });
  },

  down: async (queryInterface: QueryInterface) => {
    return null;
  }
};
