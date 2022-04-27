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
            next("Email not verified");
          }
        } else {
          next("User not found");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err === 'User not found') {
          clearLogin(res);
        } else if (err === 'Email not verified') {
          clearLogin(res);
          res.redirect('/');
        } else if (err.name === 'MongooseError') {
          next("Server Error")
        }
        else {
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
    next('Unauthorized Request');
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

const checkAdmin = (req, res, next) => {
  if (req.user.type === 'admin') {
    next();
  } else {
    res.status(403).redirect('/admin/login');
  }
}

const errorHandler = (err = 'Page Not Found', req, res, next) => {
  console.log(err);
  res.status(200).render('pages/error.ejs', { message: err });
};

module.exports = { getLogin, loginFlag, errorHandler, checkMan, checkAdmin };
