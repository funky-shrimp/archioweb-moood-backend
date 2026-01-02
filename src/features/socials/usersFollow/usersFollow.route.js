import express from 'express';
import * as usersFollow from './usersFollow.controller.js';


const router = express.Router();

/**
 * @swagger
 * /usersFollow:
 *   post:
 *     summary: Follow a user
 *     tags: [usersFollow]
 *     requestBody:
 *       $ref: '#/components/requestBodies/UsersFollowBody'
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
router.post('/', usersFollow.createFollow);

/**
 * @swagger
 * /usersFollow/{id}:
 *   delete:
 *     summary: Unfollow a user
 *     tags: [usersFollow]
 *     parameters:
 *       - $ref: '#/components/parameters/FollowedId'
 *     requestBody:
 *       $ref: '#/components/requestBodies/UsersFollowDeleteBody'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UsersFollowDeleted'
 */
router.delete('/:id', usersFollow.deleteFollow);

/**
 * @swagger
 * components:
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
 *   parameters:
 *     FollowedId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: The followed user ID
 *   requestBodies:
 *     UsersFollowBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - followerId
 *               - followedId
 *             properties:
 *               followerId:
 *                 type: string
 *               followedId:
 *                 type: string
 *           example:
 *             followerId: "692dc617cc95bd5ca6bff2b8"
 *             followedId: "69245b51506e0a66ed3087ce"
 *     UsersFollowDeleteBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - followerId
 *             properties:
 *               followerId:
 *                 type: string
 *           example:
 *             followerId: "692dc617cc95bd5ca6bff2b8"
 */

export default router;