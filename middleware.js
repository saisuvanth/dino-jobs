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
        console.log(err);
        if (err === 'User not found') {
          clearLogin(res);
        } else if (err === 'Email not verified') {
          clearLogin(res);
          res.redirect('/');
        } else {
          err
            .removeToken(cookie)
            .then(() => {
              clearLogin(res);
            })
            .catch((err) => console.log(err));
        }
      });
  } else {
    res.redirect("/");
  }
};

const checkMan = (req, res, next) => {
  if (req.user.type === 'manager') {
    next();
  } else {
    throw 'Unauthorized Request';
  }
}


const clearLogin = (res) => {
  res.clearCookie('login');
  res.redirect('/');
}

const loginFlag = (req, res, next) => {
  const cookie = req.cookies.login;
  if (cookie) {
    res.redirect("/home");
  } else {
    next();
  }
};

const errorHandler = (req, res, next) => {
  console.log(req.err);
  res.status(500).send("Something went wrong");
};

module.exports = { getLogin, loginFlag, errorHandler, checkMan };
