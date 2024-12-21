const express = require("express");
const { validateSignup } = require("../utils/validation");
const bcrypt = require("bcrypt");
const { User } = require("../models/user.js");
const validator = require("validator");

const authRouter = express.Router();

authRouter.post("/signup", async function (req, res) {
  try {
    // validation logic
    validateSignup(req);

    // hashing the password
    const { firstName, lastName, emailId, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    await user.save();

    res.send("User added successfully in the database");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

authRouter.post("/login", async function (req, res) {
  const { emailId, password } = req.body;

  if (!emailId || !password) {
    throw new Error("Email and Password are required");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address");
  }

  try {
    const user = await User.findOne({ emailId: emailId });
    // console.log(user)
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await user.validatePassword(password);

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    } else {
      const token = await user.getJWT();
      res.cookie("token", token, { expires: new Date(Date.now() + 900000) });
      res.send("User login successfully");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = {
    authRouter
}
