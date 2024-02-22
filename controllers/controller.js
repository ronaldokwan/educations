const {
  User,
  Teacher,
  Courses,
  UserDetail,
  UserCourses,
} = require("../models/index");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const capitalizeFirstLetter = require("../utils/helper");

class Controller {
  static async login(req, res) {
    try {
      const { error } = req.query;
      res.render("login", { error });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  static async loginProcess(req, res) {
    try {
      const { name, password } = req.body;
      const user = await User.findOne({ where: { name } });
      if (user) {
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (isValidPassword) {
          req.session.userId = user.id;
          return res.redirect("/");
        } else {
          const error = "invalid username/password";
          return res.redirect(`/login?error=${error}`);
        }
      } else {
        const error = "invalid username/password";
        return res.redirect(`/login?error=${error}`);
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  static async register(req, res) {
    try {
      res.render("register");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  static async registerProcess(req, res) {
    try {
      const { name, password, email, role } = req.body;
      await User.create({ name, password, email, role });
      res.redirect("/login");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        let errors = error.errors.map((item) => {
          return item.message;
        });
        res.redirect(`/register?error=${errors}`);
      } else {
        console.log(error.message);
        res.send(error.message);
      }
    }
  }
  static async logout(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          res.send(err);
        } else {
          res.redirect("/login");
        }
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  static async home(req, res) {
    try {
      let data = await User.findAll({
        include: {
          model: UserCourses,
          include: {
            model: Courses,
            include: Teacher,
          },
        },
      });
      let search = req.query.search;
      if (search) {
        data = await User.findAll({
          where: {
            name: {
              [Op.iLike]: `%${search}%`,
            },
          },
          include: {
            // model: Courses,
            model: UserCourses,
            include: {
              model: Courses,
              include: Teacher,
            },
          },
        });
      }
      // res.send(data);
      res.render("home", { data });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  static async user(req, res) {
    try {
      let message = req.query.error;
      let del = req.query.message;
      let data = await User.findAll({
        include: UserDetail,
        order: [["name", "asc"]],
      });
      // res.send(data);
      res.render("user", {
        data,
        capitalizeFirstLetter,
        message,
        del,
        UserDetail,
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  static async add(req, res) {
    try {
      let data = await UserDetail.findAll({
        where: {
          UserId: req.params.id,
        },
      });
      res.render("edit", { data });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  static async edit(req, res) {
    try {
      let data = await UserDetail.findAll({
        where: {
          UserId: req.params.id,
        },
      });
      if (data.length !== 0) {
        res.render("edit", { data });
      } else {
        res.redirect(`/user?message=nothing to edit`);
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  static async editProcess(req, res) {
    try {
      await UserDetail.update(
        {
          age: req.body.age,
          hobby: req.body.hobby,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.redirect(`/user`);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        let errors = error.errors.map((item) => {
          return item.message;
        });

        res.redirect(`/user?error=${errors}`);
      } else {
        console.log(error.message);
        res.send(error.message);
      }
    }
  }
  static async delete(req, res) {
    try {
      let message = await UserDetail.findAll({
        where: {
          UserId: req.params.id,
        },
      });

      if (message[0]) {
        await UserDetail.destroy({
          where: {
            UserId: req.params.id,
          },
        });
        res.redirect(
          `/user?message=id=${req.params.id},age = ${message[0].age} with hobby = ${message[0].hobby} has been removed`
        );
      } else {
        res.redirect("/user?message=nothing to delete");
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  static async chart(req, res) {
    try {
      let data = await UserDetail.findAll();
      const ageLabels = data.map((obj) => obj.age);
      const userIdData = data.map((obj) => obj.UserId);
      res.render("chart", { ageLabels, userIdData });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  static async add(req, res) {
    try {
      let id = req.params.id;
      let data = await UserDetail.findAll({
        where: {
          UserId: req.params.id,
        },
      });
      if (data.length !== 0) {
        res.redirect(`/user?message=nothing to add`);
      } else {
        res.render("add", { id });
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  static async addProcess(req, res) {
    try {
      await UserDetail.create({
        UserId: req.params.id,
        age: req.body.age,
        hobby: req.body.hobby,
      });
      res.redirect(`/user`);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        let errors = error.errors.map((item) => {
          return item.message;
        });

        res.redirect(`/user?error=${errors}`);
      }
    }
  }
}

module.exports = Controller;
