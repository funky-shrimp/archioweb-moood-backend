import Labels from "./label.model.js";
import {unlinkLabelToBoards} from "../boardsLabel/boardsLabel.utils.js";

//get labels, post labels, delete labels by id, get labels/:id/boards

async function getAllLabels() {
    return Labels.find();
}

async function createLabel(labelData) {
    const label = new Labels(labelData);
    return label.save();
}

async function deleteLabel(labelId) {
    //if label is linked to boards, we should unlink them first
    await unlinkLabelToBoards(labelId);

    return Labels.findByIdAndDelete(labelId);
}

export { getAllLabels, createLabel, deleteLabel };
