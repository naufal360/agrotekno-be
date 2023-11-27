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
        prefix: 'SOC-WET',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        prefix: 'ECO-WET',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        prefix: 'ENV-WET',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        prefix: 'SOC-DRY',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        prefix: 'ECO-DRY',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        prefix: 'ENV-DRY',
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
