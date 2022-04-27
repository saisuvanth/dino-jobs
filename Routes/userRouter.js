const { Router } = require("express");
const {
  login,
  signup,
  verifyEmail,
  updateUser,
  applyJob,
  createJob,
  uploadUserPhoto,
  resizeUserPhoto,
  logout,
  deleteUser,
  getJobApplicants,
  managerProfile
} = require("../controllers/userController");
const { getLogin, checkMan, checkAdmin } = require("../middleware");
const router = Router();


router.get('/home', getLogin, (req, res, next) => {
  if (req.user.type === 'manager') {
    res.redirect('/manager/home');
  } else {
    res.redirect('/user/home');
  }
})

router.post("/:title/login", (req, res, next) => {
  login(req, req.params.title, res).then((token) => {
    if (token) {
      res
        .cookie("login", token)
        .status(200)
        .json({ message: "Login Successful" });
    } else {
      req.err = "Invalid Credentials";
      next();
    }
  }).catch(err => {
    req.err = err;
    next();
  })
});

router.post("/:title/register", async (req, res, next) => {
  const { email, password, full_name } = req.body;
  await signup({ email, password, full_name, type: req.params.title, email_verified: false }, res);
});

router.get("/verify/:token", (req, res, next) => {
  const token = req.params.token;
  if (verifyEmail(token)) {
    res.redirect("/");
  } else {
    res.send("No page exists");
  }
});


router.post("/update-user", getLogin, uploadUserPhoto, updateUser);

router.post('/apply-job', getLogin, applyJob);

router.post('/create-job', getLogin, checkMan, createJob);

router.get('/:type/logout', getLogin, logout);

router.get('/admin/delete/:type/:user', getLogin, checkAdmin, deleteUser);

router.post('/job/:job', getLogin, checkMan, getJobApplicants);

router.post('/manager/home', getLogin, checkMan, managerProfile);

module.exports = router;
