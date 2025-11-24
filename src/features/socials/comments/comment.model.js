import mongoose from 'mongoose';

//author, board, parentComment, content, createdAt

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required"],
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: [true, "Board ID is required"],
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
    },
    content: {
        type: String,
        required: [true, "Comment can't be empty"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Comment',commentSchema);