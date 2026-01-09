import { parse } from "dotenv";
import * as boardsService from "./boards.service.js";
import mongoose from "mongoose";
import Board from "./boards.model.js";

import { isUserThingOwner, isUserAdmin } from "../../../middlewares/utils.middleware.js";

async function getAllBoards(req, res, next) {
  try {
    // validate userId if provided in the query parameters
    let userId = undefined;

    let limit = parseInt(req.query.limit) || 2;
    let cursor = req.query.cursor || null;

    //todo : validate limit and cursor values
    // limit -> >1 and <=20
    // cursor -> valid ObjectId, (existing in the database?)
    if (limit < 1) limit = 2;
    if (limit > 20) limit = 20;

    if (cursor && !mongoose.Types.ObjectId.isValid(cursor)) {
      throw new Error("Invalid cursor");
    }

    if (req.query.userId) {
      if (mongoose.Types.ObjectId.isValid(req.query.userId)) {
        userId = req.query.userId;
      } else {
        throw new Error("Invalid userId");
      }
    }

    res.json(await boardsService.getAllBoards(userId, { limit, cursor }));
  } catch (err) {
    next(err);
  }
}

async function createBoard(req, res, next) {
  try {
    const userId = req.user.id;
    req.body.userId = userId;

    res.json(await boardsService.createBoard(req.body));
  } catch (err) {
    next(err);
  }
}

async function getBoardById(req, res, next) {
  try {
    //console.log("Fetching board with ID:", req.params.id);
    res.json(await boardsService.getBoardById(req.params.id));
  } catch (err) {
    next(err);
  }
}

async function updateBoard(req, res, next) {
  try {
    const userId = req.user.id;
    const boardId = req.params.id;

    const isOwner = await isUserThingOwner(Board, boardId, userId);
    if (!isOwner) {
      const error = new Error("Unauthorized: Only the board owner can update this board.");
      error.status = 403;
      throw error;
    }

    res.json(await boardsService.updateBoard(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
}

async function deleteBoard(req, res, next) {
  try {
    const userId = req.user.id;
    const boardId = req.params.id;
    const userRole = req.user.role;

    const isOwner = await isUserThingOwner(Board, boardId, userId);
    const isAdmin = await isUserAdmin(userRole);

    //if user is not owner, he has to be admin to delete the board
    if (!isOwner && !isAdmin) {
      const error = new Error(
        "Unauthorized: Only the board owner or an admin can delete this board."
      );
      error.status = 403;
      throw error;
    }

    res.json(await boardsService.deleteBoard(req.params.id));
  } catch (err) {
    next(err);
  }
}

async function getCommentsByBoardId(req, res, next) {
  try {
    res.json(await boardsService.getCommentsByBoardId(req.params.id));
  } catch (err) {
    next(err);
  }
}

export {
  getAllBoards,
  createBoard,
  getBoardById,
  updateBoard,
  deleteBoard,
  getCommentsByBoardId,
};
