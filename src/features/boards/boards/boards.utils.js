import mongoose from "mongoose";

import BoardsModel from "./boards.model.js";

async function getBoardsWithLikesUserLabels(boardId = null) {
  const pipeline = [];

  // Add $match if boardId is provided
  if (boardId) {
    pipeline.push({
      $match: { _id: new mongoose.Types.ObjectId(boardId) },
    });
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

export { getBoardsWithLikesUserLabels };
