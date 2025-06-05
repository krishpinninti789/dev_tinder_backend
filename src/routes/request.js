const userAuth = require("../middleware/auth/admin");
const express = require("express");
const ConnectionRequest = require("../models/ConnectionRequest");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:id", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params?.id;

    const status = req.params.status;

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnectionRequest) {
      res.status(400).send("Connection request already exist");
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

module.exports = requestRouter;
