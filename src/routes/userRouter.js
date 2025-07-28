const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const { ConnectionRequest } = require("../models/connectionRequest.js");
const { User } = require("../models/user.js");

const userRouter = express.Router();

const USER_SAFE_DATA = "photoUrl firstName lastName gender about age skills";

userRouter.get("/user/requests/received", userAuth, async function (req, res) {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Pending connection requests retrieved successfully",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).json({ message: `ERROR : ${err.message}` });
  }
});

userRouter.get("/user/connections", userAuth, async function (req, res) {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ message: "All connections retreived successfully", data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/user/feed", userAuth, async function (req, res) {
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  limit = limit > 50 ? 50 : limit;

  try {
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: req.user?._id }, { toUserId: req.user?._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequest.forEach(function (key) {
      hideUsersFromFeed.add(key.fromUserId.toString());
      hideUsersFromFeed.add(key.toUserId.toString());
    });

    const showUsers = await User.find({
      $and: [
        { _id: { $ne: req.user?._id } },
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: showUsers });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = { userRouter };
