exports.getLanding = function (req, res, next) {
  res.status(200).render("pages/index", { title: "Home" });
};

exports.getHome = function (req, res, next) {
  res.status(200).render("pages/home", { title: "Home" });
};

exports.getProfile = (req, res, next) => {
  res.status(200).render("pages/user/profile", { title: "Profile" });
}
