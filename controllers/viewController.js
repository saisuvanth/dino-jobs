

const getHome = function (req, res, next) {
  res.status(200).render("pages/index", { title: "Home" });
};

const getProfile = (req, res, next) => {
  res.status(200).render("pages/user/profile", { title: "Profile" });
}

module.exports = {getHome,getProfile};
