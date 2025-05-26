const validator = require("validator");

const validateReq = (req) => {
  const { firstName, lastName, password, email } = req.body;
  if (!firstName || !lastName) {
    throw new Error("First or lastname are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Strong password is required");
  } else {
    return;
  }
};

module.exports = validateReq;
