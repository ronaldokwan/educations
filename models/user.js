"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserDetail, {
        foreignKey: "UserId",
      });
      User.hasMany(models.UserCourses, {
        foreignKey: "UserId",
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate(instance, options) {
          var salt = bcrypt.genSaltSync(5);
          var hash = bcrypt.hashSync(instance.password, salt);
          instance.password = hash;
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
