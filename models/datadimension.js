'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DataDimension extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DataDimension.belongsTo(models.Users, { foreignKey: 'userId' })
      // DataDimension.hasMany(models.SocialEcoEnv, { foreignKey: 'dataDimensionId' })
    }
  }
  DataDimension.init({
    // idCode: DataTypes.STRING,
    name: DataTypes.STRING,
    grade: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'DataDimension',
  });
  return DataDimension;
};