'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     */
     await queryInterface.bulkInsert('PrefixCodes', [
      {
        prefix: 'SOC',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        prefix: 'ECO',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        prefix: 'ENV',
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
     * 
     */
     await queryInterface.bulkDelete('PrefixCodes', null, {});
  }
};
