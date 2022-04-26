const { Router } = require("express");
const {
  login,
  loginMan,
  signup,
  verifyEmail,
  updateUser,
  applyJob
} = require("../controllers/userController");
const { getLogin, errorHandler } = require("../middleware");
const router = Router();


router.get('/home', getLogin, (req, res, next) => {
  if (req.user.type === 'manager') {
    res.redirect('/manager/home');
  } else {
    res.redirect('/user/home');
  }
})

router.post("/:title/login", (req, res, next) => {
  console.log(req.params.title);
  if (req.params.title === 'manager') {
    loginMan(req).then((token) => {
      if (token) {
        res
          .cookie("login", token)
          .status(200)
          .json({ message: "Login Successful" });
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    }).catch(err => {
      res.status(400).json({ message: err });
    })
  }
  else {
    login(req).then((token) => {
      if (token) {
        res
          .cookie("login", token)
          .status(200)
          .json({ message: "Login Successful" });
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    }).catch(err => {
      res.status(400).json({ message: err });
    })
  }
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

router.post("/update-user", getLogin, updateUser, errorHandler);

router.post('/apply-job', getLogin, applyJob, errorHandler);

router.get('/logout', (req, res) => {
  res.clearCookie('login');
  res.redirect('/');
});



module.exports = router;
