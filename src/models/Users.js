const mongoose = require("mongoose");
const validator = require("validator");

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

module.exports = mongoose.model("User", UserSchema);
