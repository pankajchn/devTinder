const express = require("express");
const { connectDB } = require("./config/database.js");
const { User } = require("./models/user.js");
const { validateSignup } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth.js");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async function (req, res) {
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

app.post("/login", async function (req, res) {
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

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    } else {
      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790");
      res.cookie("token", token);
      res.send("User login successfully");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

app.get("/profile", userAuth, async function (req, res) {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("Error : ", err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async function (req, res) {
  res.send(
    req.user.firstName + " " + req.user.lastName + " Sent a connection request"
  );
});

connectDB()
  .then(function () {
    console.log("Database connection succesfully established");
    app.listen(3000, function () {
      console.log("Server is running on port 3000");
    });
  })
  .catch(function (err) {
    console.error("Database can not be connected");
  });
