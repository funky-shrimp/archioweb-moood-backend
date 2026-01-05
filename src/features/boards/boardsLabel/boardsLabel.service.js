import boardsLabel from "./boardslabel.model.js";

async function createLabelBoardLink(boardId, labelId) {
  const link = new boardsLabel({ boardId, labelId });
  return await link.save();
}

async function deleteLabelBoardLink(boardId, labelId) {
  return await boardsLabel.findOneAndDelete({ boardId, labelId });
}

export { createLabelBoardLink, deleteLabelBoardLink };