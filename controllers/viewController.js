const data=require('../h.json');

const getLanding=function(req,res,next){
  res.status(200).render("pages/index",{title:"Landing"});
}

const getHome = function (req, res, next) {
  res.status(200).render("pages/home", { jobs: data });
};


const getProfile = (req, res, next) => {
  res.status(200).render("pages/user/profile", { title: "Profile" });
}

const getJobPost = (req, res, next) => {
  res.status(200).render("pages/user/jobpost", { title: "Job Posting" });
}


module.exports = {getHome,getProfile,getLanding,getJobPost};
