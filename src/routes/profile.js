const User = require("../models/Users");
const userAuth = require("../middleware/auth/admin");
const express = require("express");
const { validateEditProfileData } = require("../utils/validator");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const userData = req.user;

    res.send(userData);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Unable to update the profile!!");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    loggedInUser.save();
    res.send(`${loggedInUser.firstName},your profile has updated.`);
  } catch (err) {
    res.status(404).send("ERROR : " + err);
  }
});

profileRouter.get("/feed", userAuth, async (req, res) => {
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
