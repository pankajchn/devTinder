const express = require("express");
const { connectDB } = require("./config/database.js");
const { User } = require("./models/user.js");
const { validateSignup } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const validator = require("validator");

const app = express();

app.use(express.json());

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

    res.send("User added successfully");
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
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    } else {
      res.send("User login successfully");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

app.get("/user", async function (req, res) {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async function (req, res) {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(404).send("Something Went Wrong");
  }
});

app.delete("/user", async function (req, res) {
  const userId = req.body._id;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User successfully deleted");
  } catch (err) {
    res.status(404).send("User can not be deleted");
  }
});

app.patch("/user/:_id", async function (req, res) {
  const userId = req.params._id;
  const data = req.body;

  const allowedUpdates = ["password", "age", "skills", "gender", "about"];
  const updateData = Object.keys(data).filter((ele) => ele !== "_id");
  const isUpdateAllowed = updateData.every((element) =>
    allowedUpdates.includes(element)
  );

  try {
    if (!isUpdateAllowed) {
      throw new Error("Can not update the user");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills don't have more than 10 skills");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
    });
    res.send("User Updated Successfully");
  } catch (err) {
    res.status(400).send("Update Failed : " + err.message);
  }
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
