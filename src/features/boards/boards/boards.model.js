import mongoose from "mongoose";

const limitations = {
  titleMaxLength: 30,
  descriptionMaxLength: 200,
};

//title, description, creator, isPublic, createdAt

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    validate: {
      validator: function (v) {
        // limited bio to 30 characters
        return v.length <= limitations.titleMaxLength;
      },
      message: (props) =>
        `Title is above ${limitations.titleMaxLength} characters!`,
    },
  },
  description: {
    type: String,
    default: "",
    validate: {
      validator: function (v) {
        // limited bio to 30 characters
        return v.length <= limitations.descriptionMaxLength;
      },
      message: (props) =>
        `Description is above ${limitations.descriptionMaxLength}  characters!`,
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Board", boardSchema);
