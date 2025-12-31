import Boards from "./boards.model.js";
import Comments from "../../socials/comments/comment.model.js";

import { addAuthorToComment } from "../../socials/comments/comments.utils.js";

import {checkLabelExists, linkLabelsToBoard} from "../boardsLabel/boardsLabel.utils.js";

async function getAllBoards() {
  return Boards.find();
}

async function createBoard(boardData) {
  let labelsIds = [];

  console.log("Creating board with data:", boardData);

  //check if label is added in boardData
  if (boardData.labels && boardData.labels.length > 0) {
    labelsIds = await checkLabelExists(boardData.labels);
  }

  // create new board and save it
  const board = new Boards(boardData);

  const newBoard = await board.save();

  // links labels in boardsLabel
  if (labelsIds.length > 0) {
    const result = await linkLabelsToBoard(newBoard._id, labelsIds);
    console.log("Labels linked to board:", result);
  }

  return newBoard;
}

async function getBoardById(id) {
  return Boards.findById(id);
}

async function updateBoard(id, boardData) {
  return Boards.findByIdAndUpdate(id, boardData, { new: true });
}

async function deleteBoard(id) {
  return Boards.findByIdAndDelete(id);
}

async function getCommentsByBoardId(id) {
  const comments = await Comments.find({ boardId: id });
  return await addAuthorToComment(comments);
}

export {
  getAllBoards,
  createBoard,
  getBoardById,
  updateBoard,
  deleteBoard,
  getCommentsByBoardId,
};
