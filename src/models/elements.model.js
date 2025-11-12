import mongoose from 'mongoose';

//boardId, type, contentUrl, textContent, positionX, positionY, width, height, rotation, zIndex, createdAt

const elementSchema = new mongoose.Schema({
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    type: {
        type: String,
        enum: ['text', 'image', 'video', 'audio', 'shape'],
        required: true,
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
        required: true,
    },
    positionY:{
        type: Number,
        required: true,
    },
    width:{
        type: Number,
        required: true,
    },
    height:{
        type: Number,
        required: true,
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