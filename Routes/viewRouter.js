const { Router } = require("express");
const authController = require("../controllers/authController");
const {getHome,getProfile} = require("../controllers/viewController");
const userController = require("../controllers/userController");
const router = Router();

// router.get("/login", viewController.getLogin);
router.get("/", getHome);
router.get("/profile", getProfile);

module.exports = router;
