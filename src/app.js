const express = require("express");
const connectToDB = require("./config/db");
const User = require("./models/Users");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const userData = req.body; //Here we are getting the data from the request body trough postman api
  console.log(userData);

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
