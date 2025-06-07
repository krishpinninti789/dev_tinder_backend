const express = require("express");
const userAuth = require("../middleware/auth/admin");
const ConnectionRequest = require("../models/ConnectionRequest");
const Users = require("../models/Users");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // console.log(loggedInUser);

    const data = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Connection requests fetched",
      data,
    });
  } catch (err) {
    res.status(500).send("ERROR" + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
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

    res.send(data);
  } catch (err) {
    res.status(400).send("ERROR" + err);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    // console.log(connectionRequests);

    const hideUsersfromFeed = new Set();

    connectionRequests.forEach((entry) => {
      hideUsersfromFeed.add(entry.fromUserId.toString());
      hideUsersfromFeed.add(entry.toUserId.toString());
    });

    const users = await Users.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersfromFeed) } },
        {
          _id: { $ne: loggedInUser._id },
        },
      ],
    }).select(USER_SAFE_DATA);

    res.send(users);
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

module.exports = userRouter;
