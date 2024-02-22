"use strict";
const fs = require("fs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = fs.readFileSync("./data/userCourses.json");
    data = JSON.parse(data);
    data.forEach((element) => {
      element.createdAt = new Date();
      element.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("UserCourses", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UserCourses", null, {});
  },
};
