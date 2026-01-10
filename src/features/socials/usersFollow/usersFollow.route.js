import express from "express";
import * as usersFollow from "./usersFollow.controller.js";

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
 *     FollowedIdPath:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: The user ID to follow
 *       example: "69245b51506e0a66ed3087ce"
 *   schemas:
 *     UsersFollow:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         followerId:
 *           type: string
 *         followedId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *   responses:
 *     UsersFollow:
 *       description: User follow object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsersFollow'
 *           example:
 *             _id: "5f8d0d55b54764421b7156c1"
 *             followerId: "692dc617cc95bd5ca6bff2b8"
 *             followedId: "69245b51506e0a66ed3087ce"
 *             createdAt: "2025-12-01T19:28:41.566Z"
 *     UsersFollowDeleted:
 *       description: User follow deleted
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *           example:
 *             message: "User follow deleted successfully."
 */

/**
 * @swagger
 * /usersFollow/{id}:
 *   post:
 *     summary: Follow a user
 *     tags: [usersFollow]
 *     security:
 *       - bearerAuth: [] # JWT Token
 *     parameters:
 *       - $ref: '#/components/parameters/FollowedIdPath'
 *     requestBody:
 *       description: No body required. The followerId is taken from the JWT token, and followedId from the path parameter.
 *       required: false
 *     responses:
 *       201:
 *         $ref: '#/components/responses/UsersFollow'
 *       400:
 *         description: Already following
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "You already follow this user."
 */
router.post("/:id", usersFollow.createFollow);

/**
 * @swagger
 * /usersFollow/{id}:
 *   delete:
 *     summary: Unfollow a user
 *     tags: [usersFollow]
 *     security:
 *       - bearerAuth: [] # JWT Token
 *     parameters:
 *       - $ref: '#/components/parameters/FollowedIdPath'
 *     requestBody:
 *       description: No body required. The followerId is taken from the JWT token, and followedId from the path parameter.
 *       required: false
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UsersFollowDeleted'
 */
router.delete("/:id", usersFollow.deleteFollow);

export default router;
