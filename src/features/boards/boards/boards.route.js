import express from 'express';
import * as boardsController from './boards.controller.js';
import isOwner from '../../../middlewares/isOwner.middleware.js';
import { authenticateJWT } from '../../../auth/JWT/auth.jwt.middleware.js';

const router = express.Router();

router.get('/', boardsController.getAllBoards);
router.post('/', boardsController.createBoard);

router.get('/:id', boardsController.getBoardById);
router.put('/:id',authenticateJWT ,isOwner, boardsController.updateBoard);
router.delete('/:id',authenticateJWT, isOwner, boardsController.deleteBoard);

router.get('/:id/comments', boardsController.getCommentsByBoardId);

export default router;