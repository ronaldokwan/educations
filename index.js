const express = require("express");
const app = express();
const port = 3000;
const Controller = require("./controllers/controller");
const session = require("express-session");
const sequelize = require("./models").sequelize;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: true }, // http-.false / https->true, sameSite - > security from csrf attack
  })
);

app.get("/register", Controller.register);
app.post("/register", Controller.registerProcess);
app.get("/login", Controller.login);
app.post("/login", Controller.loginProcess);

app.get("/logout", Controller.logout);
// global middle ware
app.use((req, res, next) => {
  if (!req.session.userId) {
    const error = "Please login first";
    res.redirect(`/login?error=${error}`);
  } else {
    next();
  }
});

app.get("/", Controller.home);
app.get("/user", Controller.user);
app.get("/user/edit/:id", Controller.edit);
app.post("/user/edit/:id", Controller.editProcess);
app.get("/user/delete/:id", Controller.delete);
app.get("/user/chart", Controller.chart);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
