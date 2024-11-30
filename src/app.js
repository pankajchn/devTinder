const express = require("express");

const app = express();

app.use("/test", function(req,res){
    res.send("Breaking bad!")
})

app.use("/home", function(req,res){
    res.send("This is my Home Page")
})

app.use("/about", function(req,res){
    res.send("This is our About Us page")
})

app.use("/service", function(req,res){
    res.send("This is our Services Page")
})

app.use(function (req, res) {
  res.send("Hello from the server");
});




app.listen(3000, function(){
    console.log("Server is successfully running on port 3000...")
});
