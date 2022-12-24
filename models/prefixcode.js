'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PrefixCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // PrefixCode.hasMany(models.SocialEcoEnv, { foreignKey: 'prefixId' })
    }
  }
  PrefixCode.init({
    prefix: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PrefixCode',
  });
  return PrefixCode;
};