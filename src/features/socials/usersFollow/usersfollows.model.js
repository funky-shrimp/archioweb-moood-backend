import mongoose from "mongoose";

const usersFollow = new mongoose.Schema({
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

// Add a unique compound index for followerId and followedId
usersFollow.index({ followerId: 1, followedId: 1 }, { unique: true });

export default mongoose.model("UserFollow",usersFollow);
