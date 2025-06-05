const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Types.ObjectId,
    },
    toUserId: {
      type: mongoose.Types.ObjectId,
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
