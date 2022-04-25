const { Router } = require("express");
const {
  getHome,
  getProfile,
  getLanding,
  getJobPost,
} = require("../controllers/viewController");
const { getLogin, loginFlag, errorHandler } = require("../middleware");
const router = Router();

router.get("/", loginFlag, getLanding);

router.get("/home", getLogin, getHome, errorHandler);

router.get("/profile", getLogin, getProfile, errorHandler);

router.get("/jobpost", getLogin, getJobPost, errorHandler);

module.exports = router;
