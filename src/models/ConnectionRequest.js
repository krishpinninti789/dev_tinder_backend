const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Types.ObjectId,
      required,
    },
    toUserId: {
      type: mongoose.Types.ObjectId,
      required,
    },
    status: {
      type: String,
      enum: ["ignored", "interested", "accepted", "rejected"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ConnectionRequest", ConnectionRequestSchema);
