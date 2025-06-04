const userAuth = require("../middleware/auth");
const express = require("express");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:id", userAuth, (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.id;

    const status = req.params.status;

    console.log(fromUserId, toUserId, status);

    res.send("Connection request sent successfully");
  } catch (err) {
    res.status(500).send("Error : " + err);
  }
});

module.exports = requestRouter;
