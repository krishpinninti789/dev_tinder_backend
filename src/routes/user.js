const express = require("express");
const userAuth = require("../middleware/auth/admin");
const ConnectionRequest = require("../models/ConnectionRequest");
const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // console.log(loggedInUser);

    const data = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Connection requests fetched",
      data,
    });
  } catch (err) {
    res.status(500).send("ERROR" + err.message);
  }
});

module.exports = userRouter;
