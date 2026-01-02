import Boards from "./boards.model.js";
import Comments from "../../socials/comments/comment.model.js";

import { addAuthorToComment } from "../../socials/comments/comments.utils.js";

import {
  checkLabelExists,
  linkLabelsToBoard,
} from "../boardsLabel/boardsLabel.utils.js";

import { getBoardsWithLikesUserLabels } from "./boards.utils.js";

async function getAllBoards(userId) {

  // initial query listing all boards
  let query = Boards.find();

  // apply userId filter if provided
  if (userId !== undefined) {
    // Check if any board exists for this userId
    const exists = await Boards.exists({ userId });
    if (!exists) {
      throw new Error("No boards found for the provided userId.");
    }

    // filter boards by userId
    query = query.where("userId").equals(userId);
  }

  // get only the _id of the boards matching the query
  // to pass to getBoardsWithLikesUserLabels
  const boards = await query.select("_id").exec();
  const boardIds = boards.map((b) => b._id);

  // If no filter, boardIds will be empty, so pass undefined to get all boards
  return await getBoardsWithLikesUserLabels(
    boardIds.length > 0 ? boardIds : undefined
  );
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
  const board = await getBoardsWithLikesUserLabels(id);
  return board[0] || null;
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
