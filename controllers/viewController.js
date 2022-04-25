const data = require("../h.json");

const getLanding = function (req, res, next) {
  res.status(200).render("pages/index", { title: "Landing" });
};

const getHome = function (req, res, next) {
  res.status(200).render("pages/home", { jobs: data, active: "home" });
};

const getProfile = (req, res, next) => {
  try {
    res
      .status(200)
      .render("pages/user/profile", { user: req.user, active: "profile" });
  } catch (err) {
    req.err = err;
    next();
  }
};

const getJobPost = (req, res, next) => {
  try {
    res.status(200).render("pages/user/jobpost", {
      title: "Job Posting",
      // active: "jobpost",
    });
  } catch (err) {
    req.err = err;
    next();
  }
};

module.exports = { getHome, getProfile, getLanding, getJobPost };
