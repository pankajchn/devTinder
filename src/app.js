const express = require("express");
const app = express();

app.get(
  "/user",
  (req, res, next) => {
    console.log("Handling the route user!!!");
    next();
    // res.send("Response!!");
  },
  (req, res, next) => {
    console.log("Handling the route user 2!!!");
    // res.send("2nd Response!!");
    next()
  },
  (req, res, next) => {
    console.log("Handleing the router user 3!!!");
    // res.send("3rd response!!");
    next()
  },
  (req, res, next) => {
    console.log("Handling the route user 4!!!");
    // res.send("4th response!!");
    next()
  },
  (req, res, next) => {
    console.log("Handling the route user 5!!!");
    res.send("5th response!!");
  }
);

app.listen(7777, () => {
  console.log("Server is succesfully listening on port 7777...");
});
