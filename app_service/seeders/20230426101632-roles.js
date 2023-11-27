'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    await queryInterface.bulkInsert('Roles', [
      {
        roles: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roles: 'petani',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roles: 'pedagang',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roles: 'agrobesar',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roles: 'agrokecil',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
     await queryInterface.bulkDelete('Roles', null, {});
  }
};
