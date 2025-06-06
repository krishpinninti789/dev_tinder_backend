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

ConnectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send request yourself");
  }
  next();
});

ConnectionRequestSchema.index({
  fromUserId: 1,
  toUserId: 1,
});

module.exports = mongoose.model("ConnectionRequest", ConnectionRequestSchema);
