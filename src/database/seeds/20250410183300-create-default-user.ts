import { QueryInterface } from "sequelize";
import { hash } from "bcryptjs";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.sequelize.transaction(async t => {
      const passwordHash = await hash("secret@!!", 8);

      const user = await queryInterface.rawSelect('User', {
        where: {
          email: 'master@admin.com',
        },
      }, ['id']);

      if(!user) {
        return Promise.all([
          queryInterface.bulkInsert(
            "User",
            [
              {
                name: "Filipe Paladino",
                username: "@master",
                email: "master@admin.com",
                roleId: 1,
                passwordHash,
                companyId: 1,
                phone: `554399701234`,
                emailVerifiedAt: new Date(),
                phoneVerifiedAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                active: true,
                owner: true,
              }
            ],
            {transaction: t}
          )
        ]);
      }

      return null;

    });
  },

  down: async (queryInterface: QueryInterface) => {
    return null;
  }
};
