const express = require("express");

const app = express();

// app.get(/.*fly$/, function (req, res) {
//   res.send({ firstName: "Pankaj", lastName: "Chouhan" });
// });

// app.get("/user", function (req, res) {
//   console.log(req.query);
//   res.send({ fName: "Pankaj", lName: "Chouhan" });
// });

app.get("/user/:userId/:password/:city", function (req, res) {
  console.log(req.params);
  res.send({ fName: "Pankaj", lName: "Chouhan" });
});

app.listen(3000, function () {
  console.log("Server is successfully running on port 3000...");
});
