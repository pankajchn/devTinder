const jwt = require("jsonwebtoken");
const { User } = require("../models/user.js");
require('dotenv').config();


const userAuth =  async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    //we are checking that token is present in request or not, if token is not present there we are sending the response form here only the below code doesn't excute
    if (!token) {
      return res.status(401).send("Unauthorized Request");
    }

    // Here we are verifying the token. This functionwill take two arguments first is token itself and second is secret key that we passed when we have created the token 
    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
  next();
};

module.exports = { userAuth };
