exports.getLogin = function (req, res, next) {
  res.status(200).render("login", { title: "Login" });
};

exports.getHome = function (req, res, next) {
  res.status(200).render("pages/index", { title: "Home" });
};
