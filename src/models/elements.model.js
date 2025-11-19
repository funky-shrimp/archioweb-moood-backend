import mongoose from 'mongoose';

//boardId, type, contentUrl, textContent, positionX, positionY, width, height, rotation, zIndex, createdAt

const elementSchema = new mongoose.Schema({
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: [true, "Board ID is required"],
    },
    type: {
        type: String,
        enum: ['text', 'image', 'video', 'audio', 'shape'],
        required: [true,"Type is required"],
    },
    contentUrl: {
        type: String,
        default: null,
    },
    textContent: {
        type: String,
        default: null,
    },
    positionX:{
        type: Number,
        required: [true,"Position X is required"],
    },
    positionY:{
        type: Number,
        required: [true,"Position Y is required"],
    },
    width:{
        type: Number,
        required: [true,"Width is required"],
    },
    height:{
        type: Number,
        required: [true,"Height is required"],
    },
    rotation:{
        type: Number,
        default: 0,
    },
    zIndex:{
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Element', elementSchema);