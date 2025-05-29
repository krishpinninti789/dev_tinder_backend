const express = require("express");
const app = express();
const connectToDB = require("./config/db");
const cookieparser = require("cookie-parser");

app.use(express.json());
app.use(cookieparser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
app.use("/", authRouter);
app.use("/", profileRouter);

connectToDB()
  .then(() => {
    console.log("COnnceted to db");
    app.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((err) => console.log(err));
