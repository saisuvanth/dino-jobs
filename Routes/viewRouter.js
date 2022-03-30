const { Router } = require("express");
const {getHome,getProfile,getLanding,getJobPost} = require("../controllers/viewController");
const {getLogin,loginFlag}=require('../middleware');
const router = Router();


router.get("/",loginFlag ,getLanding);

router.get('/home',getLogin,getHome);

router.get("/profile",getLogin ,getProfile);

router.get('/jobpost',getLogin,getJobPost);

module.exports = router;
