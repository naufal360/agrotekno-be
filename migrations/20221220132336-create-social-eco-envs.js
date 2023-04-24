'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SocialEcoEnvs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      prefixId: {
        allowNull: false,
        foreignKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: "PrefixCodes",
          key: "id"
        },
      },
      dataDimensionId: {
        allowNull: false,
        foreignKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: "DataDimensions",
          key: "id"
        },
      },
      code: {
        type: Sequelize.STRING
      },
      codeId: {
        type: Sequelize.INTEGER
      },
      firstIndicator: {
        type: Sequelize.FLOAT
      },
      secondIndicator: {
        type: Sequelize.FLOAT
      },
      thirdIndicator: {
        type: Sequelize.FLOAT
      },
      fourthIndicator: {
        type: Sequelize.FLOAT
      },
      fifthIndicator: {
        type: Sequelize.FLOAT
      },
      grade: {
        type: Sequelize.FLOAT
      },
      status:{
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SocialEcoEnvs');
  }
};