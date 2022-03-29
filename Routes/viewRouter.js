const { Router } = require("express");
const {getHome,getProfile,getLanding} = require("../controllers/viewController");
const {getLogin}=require('../middleware');
const router = Router();


router.get("/", getLanding);

router.get('/home',getLogin,getHome);

router.get("/profile",getLogin ,getProfile);

module.exports = router;
