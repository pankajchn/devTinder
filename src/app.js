const express = require("express");

const app = express();

// app.use("/user", function (req, res) {
//   res.send("Breaking bad!");
// });

app.get("/user", function (req, res) {
  res.send({ firstName: "Pankaj", lastName: "Chouhan" });
});

app.post("/user", function (req, res) {
  res.send("Data successfully sent to the database");
});

app.delete("/user", function (req, res) {
  res.send("Data successfully deleted from the database");
});

app.put("/user", (req, res) => {
  res.send("Data successfully updated ");
});

app.listen(3000, function () {
  console.log("Server is successfully running on port 3000...");
});
