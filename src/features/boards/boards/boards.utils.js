import mongoose from "mongoose";

import BoardsModel from "./boards.model.js";

async function getBoardsWithLikesUserLabels(userId, boardIdOrIds = null) {
  const pipeline = [];

  // Match stage based on whether boardIdOrIds is provided
  if (boardIdOrIds) {
    if (Array.isArray(boardIdOrIds)) {
      // Array of IDs (from getAllBoards)
      pipeline.push({
        $match: {
          _id: {
            $in: boardIdOrIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      });
    } else {
      // Single ID (from getBoardById)
      pipeline.push({
        $match: { _id: new mongoose.Types.ObjectId(boardIdOrIds) },
      });
    }
  }
  // Lookup likes and count them
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

    // Lookup to check if the specific user has liked the board
    {
      $lookup: {
        from: "boardlikes",
        let: { boardId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$boardId", "$$boardId"] },
                  { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                ],
              },
            },
          },
        ],
        as: "userLike",
      },
    },
    {
      $addFields: {
        likedByUser: { $gt: [{ $size: "$userLike" }, 0] },
      },
    },
    // Remove the temporary userLike array
    {
      $project: {
        userLike: 0,
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
