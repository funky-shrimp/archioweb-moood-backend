import express from "express";
import * as boardsController from "./boards.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Board:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *           maxLength: 30
 *         description:
 *           type: string
 *           maxLength: 200
 *         creator:
 *           type: string
 *           description: User ID
 *         isPublic:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *           description: User ID
 *         boardId:
 *           type: string
 *           description: Board ID
 *         parentCommentId:
 *           type: string
 *           nullable: true
 *           description: Parent comment ID (if reply)
 *         content:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         __v:
 *           type: integer
 *         authorName:
 *           type: string
 *           description: Name of the comment author
 *   responses:
 *     BoardList:
 *       description: A list of boards.
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Board'
 *           example:
 *             - id: "60d21b4667d0d8992e610c85"
 *               title: "My First Board"
 *               description: "Incredible board description"
 *               creator: "60c72b2f9b1d8c001c8e4b8a"
 *               isPublic: true
 *               createdAt: "2023-10-01T12:00:00Z"
 *     Board:
 *       description: Board object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Board'
 *           example:
 *             id: "60d21b4667d0d8992e610c85"
 *             title: "My New Board"
 *             description: "A description for the new board"
 *             creator: "60c72b2f9b1d8c001c8e4b8a"
 *             isPublic: true
 *             createdAt: "2023-10-01T12:00:00Z"
 *   parameters:
 *     BoardId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: The board ID
 */

/**
 * @swagger
 * /boards:
 *   get:
 *     summary: Retrieve a list of boards
 *     tags: [boards]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/BoardList'
 */
router.get("/", boardsController.getAllBoards);

/**
 * @swagger
 * /boards:
 *   post:
 *     summary: Create a new board
 *     tags: [boards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - creator
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 30
 *               description:
 *                 type: string
 *                 maxLength: 200
 *               creator:
 *                 type: string
 *                 description: User ID
 *               isPublic:
 *                 type: boolean
 *           example:
 *             title: "My New Board"
 *             description: "A description for the new board"
 *             creator: "60c72b2f9b1d8c001c8e4b8a"
 *             isPublic: true
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Board'
 */
router.post("/", boardsController.createBoard);

/**
 * @swagger
 * /boards/{id}:
 *   get:
 *     summary: Get a board by ID
 *     tags: [boards]
 *     parameters:
 *       - $ref: '#/components/parameters/BoardId'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Board'
 */
router.get("/:id", boardsController.getBoardById);

/**
 * @swagger
 * /boards/{id}:
 *   put:
 *     summary: Update a board
 *     tags: [boards]
 *     parameters:
 *       - $ref: '#/components/parameters/BoardId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 30
 *               description:
 *                 type: string
 *                 maxLength: 200
 *               isPublic:
 *                 type: boolean
 *           example:
 *             title: "Updated Board Title"
 *             description: "Updated description"
 *             isPublic: false
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Board'
 */
router.put("/:id", boardsController.updateBoard);

/**
 * @swagger
 * /boards/{id}:
 *   delete:
 *     summary: Delete a board
 *     tags: [boards]
 *     parameters:
 *       - $ref: '#/components/parameters/BoardId'
 *     responses:
 *       204:
 *         description: Board deleted
 */
router.delete("/:id", boardsController.deleteBoard);

/**
 * @swagger
 * /boards/{id}/comments:
 *   get:
 *     summary: Get comments for a board
 *     tags: [boards]
 *     parameters:
 *       - $ref: '#/components/parameters/BoardId'
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *             example:
 *               - _id: "692dec694bab9fa4d9434d3f"
 *                 userId: "692dc617cc95bd5ca6bff2b8"
 *                 boardId: "69245b51506e0a66ed3087ce"
 *                 parentCommentId: null
 *                 content: "Sausage"
 *                 createdAt: "2025-12-01T19:28:41.566Z"
 *                 __v: 0
 *                 authorName: "funkyshrimp"
 */
router.get("/:id/comments", boardsController.getCommentsByBoardId);



export default router;
