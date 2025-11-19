import mongoose from "mongoose";

const limitations = {
  bioLength: 30,
};

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    validate: {
      validator: function (v) {
        // Username must be 3-16 characters, alphanumeric and underscores only, starting with a letter
        return /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid username!`,
    },
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: function (v) {
        // correct email format
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: {
      validator: function (v) {
        // correct password format: at least 8 characters, one uppercase, one lowercase, one number, one special character
        //sAucisse6!
        return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
          v
        );
      },
      message: (props) => `The password is not valid!`,
    },
  },
  avatarUrl: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
    validate: {
      validator: function (v) {
        // limited bio to 30 characters
        return v.length <= limitations.bioLength;
      },
      message: (props) => `Bio is above ${limitations.bioLength} characters!`,
    },
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin"],
      message: "Role is either user or admin",
    },
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
