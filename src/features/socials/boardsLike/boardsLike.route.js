import express from 'express';
import * as boardsLike from './boardsLike.controller.js';


const router = express.Router();

/**
 * @swagger
 * /boardsLike:
 *   post:
 *     summary: Like a board
 *     tags: [boardsLike]
 *     requestBody:
 *       $ref: '#/components/requestBodies/BoardsLikeBody'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/BoardsLike'
 *       400:
 *         description: Already liked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "You have already liked this board."
 */
router.post('/', boardsLike.createBoardsLike);

/**
 * @swagger
 * /boardsLike/{id}:
 *   delete:
 *     summary: Unlike a board
 *     tags: [boardsLike]
 *     parameters:
 *       - $ref: '#/components/parameters/BoardId'
 *     requestBody:
 *       $ref: '#/components/requestBodies/BoardsLikeDeleteBody'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/BoardsLikeDeleted'
 */
router.delete('/:id', boardsLike.deleteBoardsLike);

/**
 * @swagger
 * components:
 *   schemas:
 *     BoardsLike:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         boardId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *   responses:
 *     BoardsLike:
 *       description: Board like object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BoardsLike'
 *           example:
 *             _id: "5f8d0d55b54764421b7156c1"
 *             userId: "692dc617cc95bd5ca6bff2b8"
 *             boardId: "69245b51506e0a66ed3087ce"
 *             createdAt: "2025-12-01T19:28:41.566Z"
 *     BoardsLikeDeleted:
 *       description: Board like deleted
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *           example:
 *             message: "Board like deleted successfully."
 *   parameters:
 *     BoardId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: The board ID
 *   requestBodies:
 *     BoardsLikeBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - boardId
 *             properties:
 *               userId:
 *                 type: string
 *               boardId:
 *                 type: string
 *           example:
 *             userId: "692dc617cc95bd5ca6bff2b8"
 *             boardId: "69245b51506e0a66ed3087ce"
 *     BoardsLikeDeleteBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *           example:
 *             userId: "692dc617cc95bd5ca6bff2b8"
 */

export default router;