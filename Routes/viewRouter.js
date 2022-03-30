const { Router } = require("express");
const {getHome,getProfile,getLanding} = require("../controllers/viewController");
const {getLogin,loginFlag}=require('../middleware');
const router = Router();


router.get("/",loginFlag ,getLanding);

router.get('/home',getLogin,getHome);

router.get("/profile",getLogin ,getProfile);

module.exports = router;
