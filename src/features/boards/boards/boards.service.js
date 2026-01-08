import Boards from "./boards.model.js";
import Comments from "../../socials/comments/comment.model.js";
import mongoose from "mongoose";


import { addAuthorToComment } from "../../socials/comments/comments.utils.js";

import {
  checkLabelExists,
  linkLabelsToBoard,
} from "../boardsLabel/boardsLabel.utils.js";

import { getBoardsWithLikesUserLabels } from "./boards.utils.js";

async function getAllBoards(userId, { limit = 20, cursor = null } = {}) {
  let queryObj = {};

  // apply userId filter if provided
  if (userId !== undefined) {
    // Check if any board exists for this userId
    const exists = await Boards.exists({ userId });
    if (!exists) {
      throw new Error("No boards found for the provided userId.");
    }

    queryObj.userId = userId;
  }

  // Cursor-based pagination: only fetch boards with _id < cursor
  if (cursor) {
    queryObj._id = { $lt: new mongoose.Types.ObjectId(cursor) };
  }

  // Query, sort, and limit
  const boards = await Boards.find(queryObj)
    .sort({ _id: -1 }) // newest first
    .limit(limit)
    .select("_id")
    .exec();

  // retrieve all Ids for aggregation
  const boardIds = boards.map((b) => b._id);

  // If no filter, boardIds will be empty, so pass undefined to get all boards
  const items = await getBoardsWithLikesUserLabels(
    boardIds.length > 0 ? boardIds : undefined
  );

  // Maintain order as per boardIds. Because the aggregation may return in different order
  const orderedItems = boardIds.map(id => items.find(b => String(b._id) === String(id))).filter(Boolean);

  // Prepare nextCursor
  let nextCursor = null;
  if (orderedItems.length === limit) {
    nextCursor = orderedItems[orderedItems.length - 1]._id;
  }

  return { items: orderedItems, nextCursor };
}

async function createBoard(boardData) {
  let labelsIds = [];

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
