const userAuth = require("../middleware/auth/admin");
const express = require("express");
const ConnectionRequest = require("../models/ConnectionRequest");
const Users = require("../models/Users");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:id", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params?.id;

    const status = req.params.status;

    const isToUserIdValid = await Users.find({ _id: toUserId });

    if (isToUserIdValid.length <= 0) {
      return res.status(400).send("User id is not valid");
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnectionRequest) {
      return res.status(400).send("Connection request already exist");
    }

    // console.log(fromUserId, toUserId, status);
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    await connectionRequest.save().then(() => {
      res.send("Connection request sent successfully");
    });
  } catch (err) {
    res.status(500).send("Error : " + err);
  }
});

requestRouter.post(
  "/request/review/:status/:reqId",
  userAuth,
  async (req, res) => {
    const { status, reqId } = req.params;
    const loggedInUser = req.user;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid rquest status",
      });
    }

    // console.log(status, reqId, loggedInUser);

    const connectionRequest = await ConnectionRequest.findOne({
      _id: reqId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    // console.log(connectionRequest);

    if (!connectionRequest) {
      return res.status(400).send("Invalid Request Id ");
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.json({
      message: "Connection request " + status,
      data,
    });
  }
);

module.exports = requestRouter;
