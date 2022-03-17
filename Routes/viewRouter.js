const {Router} = require("express");
const authController = require("../controllers/authController");
const viewController = require("../controllers/viewController");
const userController = require("../controllers/userController");
const router = Router();

router.get("/login", viewController.getLogin);
router.post('/signup', authController.signup);
router.get("/", viewController.getHome);









module.exports = router;
