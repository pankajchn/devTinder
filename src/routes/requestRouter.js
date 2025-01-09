const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const { ConnectionRequest } = require("../models/connectionRequest.js");
const { User } = require("../models/user.js");
const mongoose = require("mongoose");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: `Invalid status type: ${status}` });
      }

      const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
      if (!isValidObjectId(toUserId)) {
        return res.status(400).json({ message: `Invalid User Id` });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: `User not found` });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId }, //check if pankaj sent a connetion request to rohit
          { fromUserId: toUserId, toUserId: fromUserId }, //check if rohit sent a connection reqauest to pankaj
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request Already Exist" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      let dynamicMessage = "";
      if (status === "interested") {
        dynamicMessage = `You have shown interest in connecting with the ${toUser.firstName} ${toUser.lastName}.`;
      } else if (status === "ignored") {
        dynamicMessage = `You have chosen to ignore the connection request.`;
      }

      res.status(201).json({
        message: dynamicMessage,
        data,
      });
    } catch (error) {
      res.status(400).send("Error : " + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async function (req, res) {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: `Invalid status type: ${status}` });
      }

      const isValidRequestId = (id) => mongoose.Types.ObjectId.isValid(id);
      if (!isValidRequestId(requestId)) {
        return res
          .status(400)
          .json({ message: `Invalid Request Id:  ${requestId}` });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: `Connection request not found` });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: `Connection Request ${status}`, data });
    } catch (err) {
      res.status(400).send("Error : ", err.message);
    }
  }
);

module.exports = { requestRouter };
