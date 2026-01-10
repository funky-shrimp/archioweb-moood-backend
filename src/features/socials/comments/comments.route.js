import express from 'express';
import * as commentsController from './comments.controller.js';


const router = express.Router();

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [comments]
 *     description: |
 *       Only authenticated users can create comments.
 *     components:
 *       securitySchemes:
 *         bearerAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT
 *     security:
 *       - bearerAuth: [] # JWT Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - boardId
 *               - content
 *             properties:
 *               boardId:
 *                 type: string
 *               parentCommentId:
 *                 type: string
 *                 nullable: true
 *               content:
 *                 type: string
 *           example:
 *             boardId: "69245b51506e0a66ed3087ce"
 *             parentCommentId: null
 *             content: "Sausage"
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Comment'
 */
router.post('/', commentsController.createComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [comments]
 *     description: |
 *       Only the comment owner, the board owner, or an admin can delete a comment.
 *     security:
 *       - bearerAuth: [] # JWT Token
 *     parameters:
 *       - $ref: '#/components/parameters/CommentId'
 *     responses:
 *       200:
 *         description: Comment deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *             example:
 *               _id: "692dec694bab9fa4d9434d3f"
 *               boardId: "69245b51506e0a66ed3087ce"
 *               parentCommentId: null
 *               content: "Sausage"
 *               createdAt: "2025-12-01T19:28:41.566Z"
 *               __v: 0
 *               authorName: "funkyshrimp"
 *       403:
 *         description: Only the comment owner, board owner, or an admin can delete this comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized: Only the board owner, comment owner or an admin can delete this comment."
 */
router.delete('/:id', commentsController.deleteComment);

/**
 * @swagger
 * components:
 *   schemas:
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
 *     Comment:
 *       description: Comment object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *           example:
 *             _id: "692dec694bab9fa4d9434d3f"
 *             userId: "692dc617cc95bd5ca6bff2b8"
 *             boardId: "69245b51506e0a66ed3087ce"
 *             parentCommentId: null
 *             content: "Sausage"
 *             createdAt: "2025-12-01T19:28:41.566Z"
 *             __v: 0
 *             authorName: "funkyshrimp"
 *   parameters:
 *     CommentId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: The comment ID
 *   requestBodies:
 *     CommentBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - boardId
 *               - content
 *             properties:
 *               boardId:
 *                 type: string
 *               parentCommentId:
 *                 type: string
 *                 nullable: true
 *               content:
 *                 type: string
 *           example:
 *             boardId: "69245b51506e0a66ed3087ce"
 *             parentCommentId: null
 *             content: "Sausage"
 */

export default router;