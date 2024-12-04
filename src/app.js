const express = require("express");
const { adminAuth } = require("./middlewares/auth.js");

const app = express();

// Middleware
// app.use("/admin", function (req, res, next) {
//   const token = 12460;
//   if (token !== 12466) {
//     res.status(401).send("Unauthorized request found");
//   } else {
//     next();
//   }
// });

app.use("/admin", adminAuth);

app.get("/admin/getData", function (req, res) {
  res.send("All data has sent to the user");
});

app.get("/admin/deleteUser", function (req, res) {
  res.send("Deleted a user successfully");
});

// app.get("/admin/getAllData", function (req, res) {
//   const token = "xyzabc";
//   const isAdminAuthorized = token === "xyz";
//   if (isAdminAuthorized) {
//     res.send("All data have sent");
//   } else {
//     res.status(401).send("Unauthorized request");
//   }
// });

// app.get("/admin/deleteUser", function (req, res) {
//   const token = "abcxyz";
//   const isAdminAuthorized = token === "abc";
//   if (isAdminAuthorized) {
//     res.send("Deleted user successfully");
//   } else {
//     res.status(401).send("Unauthorized request");
//   }
// });

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
