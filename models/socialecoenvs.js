'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SocialEcoEnvs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SocialEcoEnvs.belongsTo(models.DataDimension, { foreignKey: "dataDimensionId", sourceKey: "id" })
    }
  }
  SocialEcoEnvs.init({
    prefixId: DataTypes.INTEGER,
    code: DataTypes.STRING,
    codeId: DataTypes.INTEGER,
    firstIndicator: DataTypes.FLOAT,
    secondIndicator: DataTypes.FLOAT,
    thirdIndicator: DataTypes.FLOAT,
    fourthIndicator: DataTypes.FLOAT,
    fifthIndicator: DataTypes.FLOAT,
    grade: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SocialEcoEnvs',
  });
  return SocialEcoEnvs;
};