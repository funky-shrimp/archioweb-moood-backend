import Labels from "./label.model.js";

//get labels, post labels, delete labels by id, get labels/:id/boards

async function getAllLabels() {
    return Labels.find();
}

async function createLabel(labelData) {
    const label = new Labels(labelData);
    return label.save();
}

async function deleteLabel(labelId) {
    return Labels.findByIdAndDelete(labelId);
}

export { getAllLabels, createLabel, deleteLabel };
