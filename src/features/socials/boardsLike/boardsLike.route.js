import express from "express";
import * as boardsLike from "./boardsLike.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   parameters:
 *     BoardIdPath:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: The board ID to like
 *       example: "69245b51506e0a66ed3087ce"
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
 */

/**
 * @swagger
 * /boardsLike/{id}:
 *   post:
 *     summary: Like a board
 *     tags: [boardsLike]
 *     security:
 *       - bearerAuth: [] # JWT Token
 *     parameters:
 *       - $ref: '#/components/parameters/BoardIdPath'
 *     requestBody:
 *       description: No body required. The userId is taken from the JWT token, and boardId from the path parameter.
 *       required: false
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
router.post("/:id", boardsLike.createBoardsLike);

/**
 * @swagger
 * /boardsLike/{id}:
 *   delete:
 *     summary: Unlike a board
 *     tags: [boardsLike]
 *     security:
 *       - bearerAuth: [] # JWT Token
 *     parameters:
 *       - $ref: '#/components/parameters/BoardIdPath'
 *     requestBody:
 *       description: No body required. The userId is taken from the JWT token, and boardId from the path parameter.
 *       required: false
 *     responses:
 *       200:
 *         $ref: '#/components/responses/BoardsLikeDeleted'
 */
router.delete("/:id", boardsLike.deleteBoardsLike);

export default router;
