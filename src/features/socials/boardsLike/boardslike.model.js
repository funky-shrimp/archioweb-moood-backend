import mongoose from 'mongoose';

//userId, boardId, createdAt

const baordLikeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: [true, 'Board ID is required'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('BoardLike', baordLikeSchema);