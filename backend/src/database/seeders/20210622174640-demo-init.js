'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'User',
      [
        {
          id: 1,
          first_name: 'Bobby',
          last_name: 'Zia',
          email: 'user1@test.com',
          password: 'abcdefg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          first_name: 'Example User 2',
          last_name: 'User 2',
          email: 'user2@test.com',
          password: 'abcdefg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          first_name: 'Example ',
          last_name: 'User 2',
          email: 'user3@test.com',
          password: 'abcdefg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('User', null, bulkDeleteOptions);
    await queryInterface.bulkDelete('Followers', null, bulkDeleteOptions);
  },
};
