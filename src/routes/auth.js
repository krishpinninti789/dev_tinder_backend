const Users = require("../models/Users");
const { validateReq } = require("../utils/validator");
const bcrypt = require("bcrypt");
const express = require("express");
const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const ispasswordValid = await user.isValidPassword(password);

    if (!ispasswordValid) {
      throw new Error("Invalid credentials");
    } else {
      const jtoken = await user.getJWT();
      // console.log(jtoken);

      // const token = "wdfetrnrgdiwsadfgtorefdvgtr";
      res.cookie("auth", jtoken);
      res.json({
        message: "Login successful!!!!",
        user,
      });
    }
  } catch (err) {
    res.status(400).send("Error : " + err);
  }
});

authRouter.post("/signup", async (req, res) => {
  const userData = req.body; //Here we are getting the data from the request body trough postman api
  // console.log(userData);

  const { firstName, lastName, email, password, gender, age } = req.body;

  validateReq(req);

  try {
    //hash the password
    const hashedpassword = await bcrypt.hash(password, 10);
    // console.log(hashedpassword);

    const user = new Users({
      firstName,
      lastName,
      email,
      password: hashedpassword,
      gender,
      age,
    });
    await user.save().then((result) => {
      res.send("User created successfully");
    });
  } catch (err) {
    res.status(400).send("Error : " + err);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("auth", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successfull!!!");
});

module.exports = authRouter;
