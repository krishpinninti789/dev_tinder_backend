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

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "email",
    "bio",
    "gender",
    "age",
  ];
  const editFields = req.body;
  const isAllowed = Object.keys(editFields).every((field) =>
    allowedEditFields.includes(field)
  );
  return isAllowed;
};

module.exports = { validateReq, validateEditProfileData };
