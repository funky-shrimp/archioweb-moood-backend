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

// Add a unique compound index for userId and boardId
baordLikeSchema.index({ userId: 1, boardId: 1 }, { unique: true });

export default mongoose.model('BoardLike', baordLikeSchema);