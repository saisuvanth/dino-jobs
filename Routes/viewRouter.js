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
  getInterviewScheduler
} = require("../controllers/viewController");
const { getLogin, loginFlag, errorHandler, checkMan } = require("../middleware");


const router = Router();

router.get("/", loginFlag, getLanding);

router.get("/user/home", getLogin, getHome, errorHandler);

router.get("/user/profile", getLogin, getProfile, errorHandler);

router.get('/user/messages', getLogin, getMessages, errorHandler);

router.get('/applied-jobs', getLogin, getAppliedJobs, errorHandler);

router.get("/manager", loginFlag, getLandingMan);

router.get('/manager/home', getLogin, checkMan, getManHome, errorHandler);

router.get("/manager/job-post", getLogin, checkMan, getJobPost, errorHandler);

router.get('/manager/interview-scheduler', getLogin, checkMan, getInterviewScheduler, errorHandler);

module.exports = router;
