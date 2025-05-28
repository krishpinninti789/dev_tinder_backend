const Users = require("../../models/Users");
const jwt = require("jsonwebtoken");

const adminAuth = async (req, res, next) => {
  try {
    const { auth } = req.cookies;
    if (!auth) {
      res.send("Token not valid!!!");
    }
    const decodedMessage = await jwt.verify(auth, "DevTinder@123");
    const { _id } = decodedMessage;
    const user = await Users.findById(_id);
    if (!user) {
      throw new Error("User not found!!!");
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
};

module.exports = adminAuth;
