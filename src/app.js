const express = require("express");
const connectToDB = require("./config/db");
const User = require("./models/Users");

const app = express();

app.use(express.json());

app.get("/user", async (req, res) => {
  try {
    const emailId = req.body.email;
    const user = await User.find({ email: emailId });

    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.send(500).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
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

app.delete("/user", async (req, res) => {
  const userId = req.body._id;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body._id;
  const data = req.body;
  // console.log(data);
  try {
    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res.send("Something went wrong");
  }
});

app.post("/signup", async (req, res) => {
  const userData = req.body; //Here we are getting the data from the request body trough postman api
  // console.log(userData);

  try {
    const user = new User(userData);
    await user.save().then((result) => {
      res.send("User created successfully");
    });
  } catch (err) {
    res.status(400).send("Error saving the user");
  }
});

connectToDB()
  .then(() => {
    console.log("COnnceted to db");
    app.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((err) => console.log(err));
