import mongoose from "mongoose";

const boardsLabels = mongoose.Schema({
    boardId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: [true, 'Board ID is required'],
    },
    labelId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Label',
        required: [true, 'Label ID is required'],
    }
})

// Add a unique compound index for boardId and labelId
boardsLabels.index({ boardId: 1, labelId: 1 }, { unique: true });

export default mongoose.model('BoardsLabel', boardsLabels);