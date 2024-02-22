"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserDetail.belongsTo(models.User, {
        foreignKey: "UserId",
      });
    }
    get format() {
      return this.hobby + " is fun";
    }
    static allUpper(role) {
      return role.toUpperCase();
    }
  }
  UserDetail.init(
    {
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "age should not be null",
          },
          notEmpty: {
            msg: "age should not be empty",
          },
          isNumeric: {
            msg: "Age must be a valid number.",
          },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      hobby: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "hobby should not be null",
          },
          notEmpty: {
            msg: "hobby should not be empty",
          },
          len: {
            args: [2, 255],
            msg: "hobby length minimal 2 to 25.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "UserDetail",
    }
  );
  return UserDetail;
};
