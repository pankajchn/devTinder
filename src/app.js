const express = require("express");
const {adminAuth, userAuth} = require("./middlewares/auth")

const app = express();

app.use("/admin", adminAuth);

app.get("/admin/getData", function (req, res) {
  res.send("All data has sent to the user");
});

app.get("/admin/deleteUser", function (req, res) {
  res.send("Successfully deleted a user");
});

app.post("/user/login", function(req,res){
  // database logic write here
  res.send("User has logged in successfully")
})

app.get("/user", userAuth, function(res,res){
  res.send("User's data sent successfully")
})

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
