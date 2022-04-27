const { Router } = require("express");
const {
  getHome,
  getProfile,
  getLanding,
  getLandingMan,
  getJobPost,
  getAppliedJobs,
  getManHome,
  getMessages,
  getInterviewScheduler,
  getHomeFilter,
  loginAdmin,
  getAdmin,
  getAbout
} = require("../controllers/viewController");


const { getLogin, loginFlag, checkMan, checkAdmin } = require("../middleware");


const router = Router();

router.get("/", loginFlag, getLanding);

router.get("/user/home", getLogin, getHome);

router.get("/user/profile", getLogin, getProfile);

router.get('/user/messages', getLogin, getMessages);

router.get('/applied-jobs', getLogin, getAppliedJobs);

router.get("/manager", loginFlag, getLandingMan);

router.get('/manager/home', getLogin, checkMan, getManHome);

router.get("/manager/job-post", getLogin, checkMan, getJobPost);

router.get('/manager/interview-scheduler', getLogin, checkMan, getInterviewScheduler);

router.get('/admin/login', loginAdmin);

router.get('/admin', getLogin, checkAdmin, getAdmin);

router.get('/about', getLogin, getAbout);



module.exports = router;
