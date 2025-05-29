const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 40,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      const isValid = validator.isEmail(value);
      if (!isValid) {
        throw new Error("Invalid email format");
      }
    },
  },
  password: {
    type: String,
    validate(value) {
      const isStrong = validator.isStrongPassword(value);
      if (!isStrong) {
        throw new Error("Password is not strong");
      }
    },
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "others"].includes(value)) {
        throw new error(err);
      }
    },
  },

  bio: {
    type: String,
    default: "This default bio",
  },
});

UserSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DevTinder@123");
  return token;
};

UserSchema.methods.isValidPassword = async function (passwordInput) {
  const user = this;
  const passwordHash = user.password;
  const pass = await bcrypt.compare(passwordInput, passwordHash);
  return pass;
};

module.exports = mongoose.model("User", UserSchema);
