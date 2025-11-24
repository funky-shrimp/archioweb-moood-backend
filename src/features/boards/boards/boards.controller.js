import * as boardsService from "./boards.service.js";

async function getAllBoards(req, res, next) {
  try {
    res.json(await boardsService.getAllBoards());
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