const User = require("../models/Users");
const adminAuth = require("../middleware/auth/admin");
const express = require("express");
const profileRouter = express.Router();

profileRouter.get("/profile", adminAuth, async (req, res) => {
  try {
    const userData = req.user;

    res.send(userData);
  } catch (err) {
    res.send("Something went wrong");
  }
});

profileRouter.patch("/user", async (req, res) => {
  const userId = req.body._id;
  const data = req.body;

  // console.log(data);
  try {
    const ALLOWED = [, "_id", "skills", "age", "bio", "gender"];

    const isAllowUpdate = Object.keys(data).every((k) => ALLOWED.includes(k));

    if (!isAllowUpdate) {
      res.status(500).send("Not Allowed to update");
    } else {
      const user = await User.findByIdAndUpdate(userId, data, {
        runValidators: true,
      });
      res.send("User updated successfully");
    }
  } catch (err) {
    res.send("Something went wrong");
  }
});

profileRouter.get("/feed", adminAuth, async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("No users found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

module.exports = profileRouter;
