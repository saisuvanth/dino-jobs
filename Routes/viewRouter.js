const {Router} = require("express");
const authController = require("../controllers/authController");
const viewController = require("../controllers/viewController");
const userController = require("../controllers/userController");
const router = Router();

router.get("/login", viewController.getLogin);
router.get("/", viewController.getHome);
router.get("/profile", viewController.getProfile); // add authController.isLoggedIn as a middleware



module.exports = router;
