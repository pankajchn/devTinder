const express = require("express");
const { connectDB } = require("./config/database.js");
const { User } = require("./models/user.js");

const app = express();

app.use(express.json());

app.post("/signup", async function (req, res) {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Error saving the user : ", error.message);
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
