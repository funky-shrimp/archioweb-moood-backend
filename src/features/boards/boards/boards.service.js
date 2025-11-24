import Boards from "./boards.model.js";
import Comments from "../../socials/comments/comment.model.js";

async function getAllBoards() {
  return Boards.find();
}

async function createBoard(boardData) {
  const board = new Boards(boardData);
  return board.save();
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
  return Comments.find({ boardId: id });
}

export { getAllBoards, createBoard, getBoardById, updateBoard, deleteBoard, getCommentsByBoardId };
