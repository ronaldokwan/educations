"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Courses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Courses.belongsTo(models.Teacher, {
        foreignKey: "TeacherId",
      });
      Courses.hasMany(models.UserCourses, {
        foreignKey: "CourseId",
      });
    }
  }
  Courses.init(
    {
      name: DataTypes.STRING,
      TeacherId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Teachers",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Courses",
    }
  );
  return Courses;
};
