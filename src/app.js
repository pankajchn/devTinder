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
    res.status(400).send("Error in saving the user : " + error.message);
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

app.patch("/user/:_id" , async function (req, res) {
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

    if(data?.skills.length > 10){
      throw new Error("Skills don't have more than 10 skills")
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
