const express = require("express");
const { userAuth } = require("../middlewares/auth.js");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, function (req, res) {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("Error : ", err.message);
  }
});

module.exports = {
  profileRouter,
};
