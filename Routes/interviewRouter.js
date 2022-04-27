const { Router } = require("express");
const { uuid } = require("uuidv4");
const router = Router();
const { getLogin, checkMan } = require("../middleware");
const { eval } = require('../utils/compiler');

router.get("/interview", getLogin, (req, res) => {
  res.redirect(`/interview/${uuid()}`);
});

router.get('/interview-scheduler', getLogin, checkMan, (req, res) => {
  res.render('interviewHandler');
})

router.get("/interview/:roomId", getLogin, (req, res) => {
  res.render("pages/room", {
    roomId: req.params.roomId,
    userName: req.user.full_name,
    userEmail: req.user.email,
  });
});

router.post("/interview/:roomId/compile", (req, res) => {
  const { code, language } = req.body;
  const result = eval(code, language);
  res.send(JSON.stringify(result));
})

module.exports = router;
