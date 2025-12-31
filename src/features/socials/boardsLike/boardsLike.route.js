import express from 'express';
import * as boardsLike from './boardsLike.controller.js';

const router = express.Router();

router.post('/', boardsLike.createBoardsLike);

router.delete('/:id', boardsLike.deleteBoardsLike);

export default router;