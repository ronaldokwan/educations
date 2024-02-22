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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "name should not be null",
          },
          notEmpty: {
            msg: "name should not be empty",
          },
          len: {
            args: [3, 20],
            msg: "name length should be between 3 and 20 characters",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "email should not be null",
          },
          notEmpty: {
            msg: "email should not be empty",
          },
          isEmail: {
            msg: "Email format is not correct",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "password should not be null",
          },
          notEmpty: {
            msg: "password should not be empty",
          },
          len: {
            args: [3, 20],
            msg: "Password length should be between 3 and 20 characters",
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "role should not be null",
          },
          notEmpty: {
            msg: "role should not be empty",
          },
        },
      },
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
