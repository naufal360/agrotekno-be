'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dimensionResult extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  dimensionResult.init({
    userId: DataTypes.INTEGER,
    name: DataTypes.ENUM("EKONOMI", "SOSIAL", "LINGKUNGAN"),
    grade: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'dimensionResult',
  });
  return dimensionResult;
};