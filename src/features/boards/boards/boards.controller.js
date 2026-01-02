import { parse } from "dotenv";
import * as boardsService from "./boards.service.js";
import mongoose from "mongoose";

async function getAllBoards(req, res, next) {
  try {

    // validate userId if provided in the query parameters 
    let userId = undefined;

    let limit = parseInt(req.query.limit) || 2;
    let cursor = req.query.cursor || null;

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
    res.json(await boardsService.createBoard(req.body));
  } catch (err) {
    next(err);
  }
}

async function getBoardById(req, res, next) {
  try {
    console.log("Fetching board with ID:", req.params.id);
    res.json(await boardsService.getBoardById(req.params.id));
  } catch (err) {
    next(err);
  }
}

async function updateBoard(req, res, next) {
  try {
    console.log("Updating board with ID:", req.params.id, "with data:", req.body);
    res.json(await boardsService.updateBoard(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
}

async function deleteBoard(req, res, next) {
  try {
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

export {getAllBoards, createBoard, getBoardById, updateBoard, deleteBoard, getCommentsByBoardId};