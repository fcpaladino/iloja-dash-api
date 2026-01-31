import { QueryInterface } from "sequelize";
// import rolePermissions from "../../config/rolePermission";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.sequelize.transaction(async t => {

      let role = [];

      const exist = await queryInterface.rawSelect('Role', {
        where: {
          id: 1,
        },
      }, ['id']);

      if(!exist){

        return Promise.all([
          queryInterface.bulkInsert(
            "Role",
            [{
              companyId: 1,
              name: 'Administrador',
              permissions: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            }],
            { transaction: t }
          )
        ]);

      }

      return null;
    });
  },

  down: async (queryInterface: QueryInterface) => {
    return null
  }
};
