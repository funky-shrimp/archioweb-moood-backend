import express from 'express';
import * as boardsController from './boards.controller';

const router = express.Router();

router.get('/', boardsController.getAllBoards);
router.post('/', boardsController.createBoard);

router.get('/:id', boardsController.getBoardById);
router.put('/:id', boardsController.updateBoard);
router.delete('/:id', boardsController.deleteBoard);

router.get('/:id/comment', boardsController.getCommentsByBoardId);

export default router;