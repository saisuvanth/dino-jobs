const { User, Job } = require('../models');

const getLanding = function (req, res, next) {
  res.status(200).render("pages/index", { title: "user" });
};

const getLandingMan = function (req, res, next) {
  res.status(200).render("pages/index", { title: "manager" });
};

const getHome = async (req, res, next) => {
  const data = await Job.find({}).populate('company');
  res.status(200).render("pages/user/home", { jobs: data, active: "home" });
};

const getManHome = function (req, res, next) {
  res.status(200).render("pages/manager/home", { user: req.user, active: "home" });
};

const getMessages = (req, res, next) => {
  try {
    res.status(200).render("pages/user/messages", {
      title: "Messages",
      active: "messages",
    });
  } catch (err) {
    req.err = err;
    next();
  }
}

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
    res.status(200).render("pages/manager/jobpost", {
      title: "Job Posting",
      active: "job-post",
    });
  } catch (err) {
    req.err = err;
    next();
  }
};

const getInterviewScheduler = (req, res) => {
  res.status(200).render("pages/manager/interview", {
    title: "Interview Scheduler",
    active: "interview-scheduler",
  });
}

const getAppliedJobs = async (req, res, next) => {
  try {
    const data = await User.findById(req.user.key).populate({ path: 'applied_jobs', populate: { path: 'company' } });
    // data.applied_jobs.populate('company');
    console.log(data);
    res.status(200).render("pages/user/appliedjob", {
      title: "Applied Jobs",
      active: "applied-jobs",
      jobs: data.applied_jobs,
    });
  } catch (err) {
    req.err = err;
    next();
  }
}

module.exports = { getHome, getProfile, getLanding, getJobPost, getAppliedJobs, getLandingMan, getManHome, getMessages, getInterviewScheduler };
