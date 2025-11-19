import mongoose from "mongoose";

const userFollow = new mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Follower ID is required"],
  },
  followedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Followed ID is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("UserFollow",userFollow);
