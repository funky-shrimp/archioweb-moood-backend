import BoardsLike from "./boardslike.model.js";

async function createBoardsLike(boardsLikeData) {
  const newBoardsLike = new BoardsLike(boardsLikeData);
  return newBoardsLike.save();
}

async function deleteBoardsLike(userId, boardId) {
  return BoardsLike.findOneAndDelete({ userId, boardId });
}

export { createBoardsLike, deleteBoardsLike };
