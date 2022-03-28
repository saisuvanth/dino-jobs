const getLanding=function(req,res,next){
  res.status(200).render("pages/index",{title:"Landing"});
}

const getHome = function (req, res, next) {
  res.status(200).render("pages/home", { title: "Home" });
};


const getProfile = (req, res, next) => {
  res.status(200).render("pages/user/profile", { title: "Profile" });
}

module.exports = {getHome,getProfile,getLanding};
