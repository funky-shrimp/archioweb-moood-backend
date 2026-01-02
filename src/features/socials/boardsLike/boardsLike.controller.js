import * as boardsLike from "./boardsLike.service.js";

async function createBoardsLike(req, res, next) {
  try {
    let userId = req.body.userId;
    let boardId = req.body.boardId;

    res.json(await boardsLike.createBoardsLike({ userId, boardId }));
  } catch (err) {
    // Check for MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ message: "You have already liked this board." });
    }
    next(err);
  }
}


async function deleteBoardsLike(req, res, next) {
  try {
    let userId = req.body.userId;
    let boardId = req.params.id;

    res.json(await boardsLike.deleteBoardsLike(userId, boardId));
  } catch (err) {
    next(err);
  }
}

export { createBoardsLike, deleteBoardsLike };