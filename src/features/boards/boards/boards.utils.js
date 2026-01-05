import mongoose from "mongoose";

import BoardsModel from "./boards.model.js";


async function getBoardsWithLikesUserLabels(boardIdOrIds = null) {
  const pipeline = [];

  // Match stage based on whether boardIdOrIds is provided
  if (boardIdOrIds) {
    if (Array.isArray(boardIdOrIds)) {
      // Array of IDs (from getAllBoards)
      pipeline.push({
        $match: { _id: { $in: boardIdOrIds.map(id => new mongoose.Types.ObjectId(id)) } },
      });
    } else {
      // Single ID (from getBoardById)
      pipeline.push({
        $match: { _id: new mongoose.Types.ObjectId(boardIdOrIds) },
      });
    }
  }

  pipeline.push(
    {
      $lookup: {
        from: "boardlikes",
        localField: "_id",
        foreignField: "boardId",
        as: "likes",
      },
    },
    {
      $addFields: {
        likes: { $size: "$likes" },
      },
    },
    {
      $lookup: {
        from: "boardslabels",
        localField: "_id",
        foreignField: "boardId",
        as: "labels",
      },
    },
    {
      $lookup: {
        from: "labels",
        localField: "labels.labelId",
        foreignField: "_id",
        as: "labels",
      },
    },
    {
      $addFields: {
        labels: "$labels.name",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $addFields: {
        user: { $arrayElemAt: ["$user.username", 0] },
      },
    }
  );

  return await BoardsModel.aggregate(pipeline).exec();
}

async function isUserBoardOwner(boardId, userId) {
  const board = await BoardsModel.findOne({ _id: boardId, userId: userId }).exec();
  if (!board) {
    return false;
  }
  return true;
}

async function isUserAdmin(userRole) {
  return userRole === 'admin';
}


export { getBoardsWithLikesUserLabels, isUserBoardOwner, isUserAdmin };
