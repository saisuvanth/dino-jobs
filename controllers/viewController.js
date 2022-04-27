const { User, Job, Company } = require('../models');

const getLanding = function (req, res, next) {
  res.status(200).render("pages/index", { title: "user" });
};

const getLandingMan = function (req, res, next) {
  res.status(200).render("pages/index", { title: "manager" });
};



const getManHome = function (req, res, next) {
  res.status(200).render("pages/manager/home", { user: req.user, active: "home" });
};

const loginAdmin = function (req, res, next) {
  res.status(200).render("pages/admin/login", { title: "Login" });
}

const getAbout = function (req, res, next) {
  res.status(200).render("pages/about", { page: req.user.type });
}

const getAdmin = async (req, res, next) => {
  const users = await User.find({}).populate({ path: 'applied_jobs', populate: { path: 'company' } });
  const companies = await Company.find({}).populate('jobs');
  const jobs = await Job.find({}).populate('company');
  console.log(users);
  res.status(200).render("pages/admin/home", { title: "Admin", users: users, companies: companies, jobs: jobs });
}

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

const getInterviewScheduler = async (req, res) => {
  const Jobs = await Job.find({ company: req.user.company });
  console.log(Jobs);
  res.status(200).render("pages/manager/interviewHandler", {
    jobs: Jobs,
    title: "Interview Scheduler",
    active: "interview-scheduler",
  });
}

const getAppliedJobData = async (user) => {
  try {
    const data = await User.findById(user.key).populate({ path: 'applied_jobs', populate: { path: 'company' } });
    return data.applied_jobs;
  } catch (err) {
    throw err;
  }
}

const getAppliedJobs = async (req, res, next) => {
  try {
    const data = await getAppliedJobData(req.user);
    // console.log(data);
    res.status(200).render("pages/user/appliedjob", {
      title: "Applied Jobs",
      active: "applied-jobs",
      jobs: data,
    });
  } catch (err) {
    req.err = err;
    next();
  }
}

const getHome = async (req, res, next) => {
  let data = await Job.find({}).populate('company');
  if (!(req.query.companySearch == undefined || req.query.locationSearch == undefined || req.query.jobSearch == undefined))
    data = filterHome(data, req.query);
  const applied = await getAppliedJobData(req.user);
  data = data.filter(job => {
    let f = true;
    applied.forEach(ajob => {
      if (ajob._id.toString() === job._id.toString()) f = false
    })
    return f;
  });
  // console.log(data);
  res.status(200).render("pages/user/home", { jobs: data, active: "home" });
};

const filterHome = (data, query) => {
  data = data.filter(d => {
    if (query.companySearch !== '') return d.company.name.includes(query.companySearch);
    if (query.locationSearch !== '') {
      const l = d.location.includes(query.locationSearch);
      return l;
    }
    if (query.jobSearch !== '') return d.role.includes(query.jobSearch);
    return false;
  });
  return data;
}




module.exports = { getHome, getProfile, getLanding, getJobPost, getAppliedJobs, getLandingMan, getManHome, getMessages, getInterviewScheduler, loginAdmin, getAdmin, getAbout };
