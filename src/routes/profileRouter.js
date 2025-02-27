const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const { validateEditProfileData } = require("../utils/validation.js");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, function (req, res) {
  try {
    const loggedInUser = req.user;
    res.json({
      message: "Profile details fetched successfully",
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).json({message: `ERROR: ${error.message}`})
  }
});

profileRouter.post("/profile/edit", userAuth, async function (req, res) {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).json({ message: `ERROR: ${error.message}` });
  }
});

module.exports = {
  profileRouter,
};
