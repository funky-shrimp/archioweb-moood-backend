import express from 'express';
import * as commentsController from './comments.controller.js';
import isOwner from '../../../middlewares/isOwner.middleware.js';

const router = express.Router();

router.post('/', commentsController.createComment);
router.delete('/:id', commentsController.deleteComment);

//get commments for a board in boards.route.js

export default router;