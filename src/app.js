const express = require("express");

const app = express();

app.get("/user", function(req,res,next){
  console.log("Handling the route user 2")
  next()
})

app.get("/user", function(req,res,next){
  console.log("Handling route user 1")
  next()
  res.send("This is Response")
})



app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
