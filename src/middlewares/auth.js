const jwt = require("jsonwebtoken");
const { User } = require("../models/user.js");
require("dotenv").config();

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      return res.status(401).send("Unauthorized request. Please login!")
    }

    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedObj;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
  } catch (err) {
    return res.status(400).send("Error : " + err.message);
  }
  next();
};

module.exports = { userAuth };
