const { User } = require("./models");

const getLogin = (req, res, next) => {
  const cookie = req.cookies.login;
  if (cookie) {
    User.findByToken(cookie)
      .then((user) => {
        if (user) {
          if (user.email_verified) {
            req.user = user.toJSON();
            next();
          } else {
            throw "Email not verified";
          }
        } else {
          throw "User not found";
        }
      })
      .catch((err) => {
        err
          .removeToken(cookie)
          .then(() => {
            res.clearCookie("login");
            res.redirect("/");
          })
          .catch((err) => console.log(err));
      });
  } else {
    res.redirect("/");
  }
};
const loginFlag = (req, res, next) => {
  const cookie = req.cookies.login;
  if (cookie) {
    res.redirect("/home");
  } else {
    next();
  }
};

const errorHandler = (req, res, next) => {};

module.exports = { getLogin, loginFlag, errorHandler };
