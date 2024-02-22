"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserCourses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserCourses.belongsTo(models.User, { foreignKey: "UserId" });
      UserCourses.belongsTo(models.Courses, { foreignKey: "CourseId" });
    }
  }
  UserCourses.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      CourseId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Courses",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "UserCourses",
    }
  );
  return UserCourses;
};
