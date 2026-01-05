import express from 'express';
import * as usersController from './users.controller.js';


const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [users]
 *     components:
 *       securitySchemes:
 *         bearerAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT
 *     security:
 *       - bearerAuth: [] # JWT Token
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserList'
 */
router.get('/', usersController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [users]
 *     security:
 *       - bearerAuth: [] # JWT Token
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/User'
 */
router.get('/:id', usersController.getUserById);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         avatarUrl:
 *           type: string
 *         bio:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         followersCount:
 *           type: integer
 *         boards:
 *           type: array
 *           items:
 *             type: string
 *   responses:
 *     UserList:
 *       description: A list of users.
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/User'
 *           example:
 *             - _id: "5f8d0d55b54764421b7156c1"
 *               username: "funkyshrimp"
 *               email: "funkyshrimp@example.com"
 *               avatarUrl: "https://example.com/avatar.png"
 *               bio: "Hello!"
 *               role: "user"
 *               createdAt: "2025-12-01T19:28:41.566Z"
 *     User:
 *       description: User object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             _id: "5f8d0d55b54764421b7156c1"
 *             username: "funkyshrimp"
 *             email: "funkyshrimp@example.com"
 *             avatarUrl: "https://example.com/avatar.png"
 *             bio: "Hello!"
 *             role: "user"
 *             createdAt: "2025-12-01T19:28:41.566Z"
 *             followersCount: 3
 *             boards:
 *               - "69245b51506e0a66ed3087ce"
 *               - "69245b51506e0a66ed3087cf"
 *   parameters:
 *     UserId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: The user ID
 */

export default router;