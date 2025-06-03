const User = require("../models/Users");
const userAuth = require("../middleware/auth/admin");
const express = require("express");
const validator = require("validator");
const { validateEditProfileData } = require("../utils/validator");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

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

profileRouter.patch("/profile/forgetPassword", async (req, res) => {
  try {
    const { emailId, passwordInputByUser } = req.body;
    const user = await User.findOne({ email: emailId });
    if (!user) {
      throw new Error("User not found");
    }

    const isOldPasswordMatch = await bcrypt.compare(
      passwordInputByUser,
      user.password
    );
    if (isOldPasswordMatch) {
      res.status(400).send("Password should not match recent passwords!!!");
    }
    const isPasswordStrong = validator.isStrongPassword(passwordInputByUser);
    if (!isPasswordStrong) {
      res.send("Password is not strong ,please enter strong password!!!");
    }
    const passwordHash = await bcrypt.hash(passwordInputByUser, 10);
    user.password = passwordHash;
    user.save();
    res.send("Password changed successfully!!!");
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
});

module.exports = profileRouter;
