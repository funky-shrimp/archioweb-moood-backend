import mongoose from "mongoose";

const boardLabel = mongoose.Schema({
    boardId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    labelId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Label',
        required: true,
    }
})

export default mongoose.model('BoardsLabel', boardLabel);