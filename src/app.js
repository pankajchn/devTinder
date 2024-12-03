const express = require("express");

const app = express();

app.use(
  "/user",
  function (req, res, next) {
    next();
    // res.send("Response!!!");
    console.log("Handling the route user");
  },
  [
    function (req, res, next) {
      // res.send("Response 2");
      console.log("Handling the route user 2");
      next();
    },
  ],
  function (req, res, next) {
    console.log("Handling the route user 3");
    next();
    res.send("Response 3");
  },
  function (req, res,next) {
    console.log("Handling the route user 4");
    next()
    res.send("Response 4");
  }
);

app.listen(3000, function () {
  console.log("Server is successfully listening on port 3000");
});
