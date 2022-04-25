const { Router } = require("express");
const {
  login,
  signup,
  verifyEmail,
  updateUser,
} = require("../controllers/userController");
const { getLogin, errorHandler } = require("../middleware");
const router = Router();

router.post("/login", (req, res, next) => {
  login(req).then((token) => {
    if (token) {
      res
        .cookie("login", token)
        .status(200)
        .json({ message: "Login Successful" });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });
});

router.post("/register", async (req, res, next) => {
  const { email, password, full_name } = req.body;
  await signup({ email, password, full_name, email_verified: false }, res);
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

module.exports = router;
