import mongoose from 'mongoose';

//username, email, password, avatarUrl, bio, createdAt

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
    email: {
    type: String,
    required: true,
    unique: true,
  },
    password: {
    type: String,
    required: true,
  },
    avatarUrl: {
    type: String,
    default: '',
    },
    bio: {
    type: String,
    default: '',
  },
    createdAt: {
    type: Date,
    default: Date.now,
    },
});

export default mongoose.model('User', userSchema);

