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

module.exports = requestRouter;
