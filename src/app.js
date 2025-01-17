const express = require("express");
const { connectDB } = require("./config/database.js");
const { User } = require("./models/user.js");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routes/authRouter.js");
const { profileRouter } = require("./routes/profileRouter.js");
const { requestRouter } = require("./routes/requestRouter.js");
const { userRouter } = require("./routes/userRouter.js");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173/",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

const port = process.env.PORT || 3000;

connectDB()
  .then(function () {
    console.log("Database connection succesfully established");
    app.listen(port, function () {
      console.log(`Server is running on ${port}`);
    });
  })
  .catch(function (err) {
    console.error("Database can not be connected", err);
  });
