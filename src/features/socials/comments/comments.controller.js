import * as commentsService from "./comments.service.js";
import Comment from "./comment.model.js";
import Board from "../../boards/boards/boards.model.js";

import { getCommentBoardId } from "./comments.utils.js";

import {
  isUserThingOwner,
  isUserAdmin,
} from "../../../middlewares/utils.middleware.js";

// Create a new comment
async function createComment(req, res, next) {
  try {
    const userId = req.user.id;
    req.body.userId = userId;

    res.json(await commentsService.createComment(req.body));
  } catch (error) {
    next(error);
  }
}

async function deleteComment(req, res, next) {
  try {
    const userId = req.user.id;
    const commentId = req.params.id;
    const userRole = req.user.role;
    const boardId = await getCommentBoardId(commentId);

    //check if user is owner of the comment
    const isOwner = await isUserThingOwner(Comment, commentId, userId);
    //check if user own the board from which the comment is issued
    const isOwnerOfBoard = await isUserThingOwner(Board, boardId, userId);

    const isAdmin = await isUserAdmin(userRole);

    //if user is not owner, nor admin, nor owner of the board, he cannot delete the comment
    if (!isOwner && !isAdmin && !isOwnerOfBoard) {
      const error = new Error(
        "Unauthorized: Only the board owner, comment owner or an admin can delete this comment."
      );
      error.status = 403;
      throw error;
    }

    res.json(await commentsService.deleteComment(req.params.id));
  } catch (error) {
    next(error);
  }
}

export { createComment, deleteComment };
