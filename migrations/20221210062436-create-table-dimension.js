'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('dimension_results', {
    id:  {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    name: {
        type: Sequelize.ENUM("EKONOMI", "SOSIAL", "LINGKUNGAN"),
        allowNull: false,
      },
    grade: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    status: {
        type: Sequelize.STRING,
        allowNull: false
      },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
   });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('dimension_results');
  }
};
