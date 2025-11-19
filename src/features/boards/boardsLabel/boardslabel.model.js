import mongoose from "mongoose";

const boardLabel = mongoose.Schema({
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

export default mongoose.model('BoardsLabel', boardLabel);