'use strict';
const {
  Model
} = require('sequelize');
const dimensionResult = require('./dimensionResult');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.hasMany(models.dimensionResult, {
        foreignKey: "userId",
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    }
  }
  users.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    roles: DataTypes.ENUM("ADMIN", "PETANI", "PEDAGANG", "AGRO_BESAR", "AGRO_KECIL"),
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};