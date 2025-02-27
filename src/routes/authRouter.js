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

    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
    });

    res.json({ message: "Signup successfully", data: user });
  } catch (error) {
    res.status(400).json({ message: `${error.message}` });
  }
});

authRouter.post("/login", async function (req, res) {
  const { emailId, password } = req.body;

  try {
    if (!emailId || !password) {
      throw new Error("Email and password fields are required");
    }
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email address");
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await user.validatePassword(password);

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    } else {
      const token = await user.getJWT();
      res.cookie("token", token, { expires: new Date(Date.now() + 7200000) });
      res.json({ message: `Login successfull`, data: user });
    }
  } catch (err) {
    res.status(400).json({ message: `${err.message}` });
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.json({ message: `Logout successfully` });
});

module.exports = {
  authRouter,
};
