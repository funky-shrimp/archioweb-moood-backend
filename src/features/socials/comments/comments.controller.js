import * as commentsService from './comments.service.js';

// Create a new comment
async function createComment(req, res, next) {
  try {
    res.json(await commentsService.createComment(req.body));
  } catch (error) {
    next(error);
  }
};

async function deleteComment(req, res, next) {
  try {
    res.json(await commentsService.deleteComment(req.params.id));
  } catch (error) {
    next(error);
  }
}

export {
  createComment,
  deleteComment,
};