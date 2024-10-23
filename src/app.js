const express = require("express");
const app = express();

app.get("/user", (req, res) => {
  res.send({ firstName: "Pankaj", lastName: "Chouhan" });
});

app.post("/user", (req, res) => {
  res.send("Data successfully saved to the database");
});

app.delete("/user", (req, res) => {
  res.send("Deleted successfully");
});

app.listen(7777, () => {
  console.log("Server is succesfully listening on port 7777...");
});
