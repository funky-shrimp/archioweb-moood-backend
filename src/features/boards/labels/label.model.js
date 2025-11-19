import mongoose from "mongoose";

const labelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // limited label to 20 characters
        return v.length <= 20;
      },
      message: (props) => `Bio is above 20 characters!`,
    },
  },
});

export default mongoose.model("Label", labelSchema);
