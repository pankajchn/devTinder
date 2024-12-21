const express = require("express");
const { userAuth } = require("../middlewares/auth.js");

const requestRouter = express.Router();

requestRouter.post("/request", userAuth, async function (req, res) {
  res.send(
    req.user.firstName + " " + req.user.lastName + " Sent a connection request"
  );
});

module.exports = { requestRouter };
