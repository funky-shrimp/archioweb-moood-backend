import express from 'express';
import * as commentsController from './comments.controller.js';


const router = express.Router();

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [comments]
 *     requestBody:
 *       $ref: '#/components/requestBodies/CommentBody'
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
 *               userId: "692dc617cc95bd5ca6bff2b8"
 *               boardId: "69245b51506e0a66ed3087ce"
 *               parentCommentId: null
 *               content: "Sausage"
 *               createdAt: "2025-12-01T19:28:41.566Z"
 *               __v: 0
 *               authorName: "funkyshrimp"
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
 *               - userId
 *               - boardId
 *               - content
 *             properties:
 *               userId:
 *                 type: string
 *               boardId:
 *                 type: string
 *               parentCommentId:
 *                 type: string
 *                 nullable: true
 *               content:
 *                 type: string
 *           example:
 *             userId: "692dc617cc95bd5ca6bff2b8"
 *             boardId: "69245b51506e0a66ed3087ce"
 *             parentCommentId: null
 *             content: "Sausage"
 */

export default router;