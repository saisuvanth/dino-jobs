const { Router } = require("express");
const { uuid } = require("uuidv4");
const router = Router();
const { getLogin } = require("../middleware");

router.get("/interview", getLogin, (req, res) => {
  res.redirect(`/interview/${uuid()}`);
});

router.get("/interview/:roomId", getLogin, (req, res) => {
  console.log(req.user);
  res.render("pages/room", {
    roomId: req.params.roomId,
    userName: req.user.full_name,
    userEmail: req.user.email,
  });
});

module.exports = router;
