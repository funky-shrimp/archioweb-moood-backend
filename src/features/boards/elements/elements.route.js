import express from 'express';
import * as elementsController from './elements.controller.js';


const router = express.Router();

/**
 * @swagger
 * /elements:
 *   get:
 *     summary: Get all elements
 *     tags: [elements]
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
 *         $ref: '#/components/responses/ElementList'
 */
router.get('/', elementsController.getElements);

/**
 * @swagger
 * /elements:
 *   post:
 *     summary: Create a new element
 *     tags: [elements]
 *     security:
 *       - bearerAuth: [] # JWT Token
 *     requestBody:
 *       $ref: '#/components/requestBodies/ElementBody'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Element'
 */
router.post('/', elementsController.createElement);

/**
 * @swagger
 * /elements/{elementId}:
 *   put:
 *     summary: Update an element
 *     tags: [elements]
 *     security:
 *       - bearerAuth: [] # JWT Token
 *     parameters:
 *       - $ref: '#/components/parameters/ElementId'
 *     requestBody:
 *       $ref: '#/components/requestBodies/ElementBody'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Element'
 */
router.put('/:elementId', elementsController.updateElement);

/**
 * @swagger
 * /elements/{elementId}:
 *   delete:
 *     summary: Delete an element
 *     tags: [elements]
 *     security:
 *       - bearerAuth: [] # JWT Token
 *     parameters:
 *       - $ref: '#/components/parameters/ElementId'
 *     responses:
 *       200:
 *         description: Element deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Element'
 *             example:
 *               _id: "5f8d0d55b54764421b7156c1"
 *               boardId: "69245b51506e0a66ed3087ce"
 *               type: "text"
 *               contentUrl: null
 *               textContent: "Hello world"
 *               positionX: 100
 *               positionY: 200
 *               width: 300
 *               height: 100
 *               rotation: 0
 *               zIndex: 1
 *               createdAt: "2025-12-01T19:28:41.566Z"
 */
router.delete('/:elementId', elementsController.deleteElement);

/**
 * @swagger
 * components:
 *   schemas:
 *     Element:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         boardId:
 *           type: string
 *         type:
 *           type: string
 *           enum: [text, image, video, audio, shape]
 *         contentUrl:
 *           type: string
 *           nullable: true
 *         textContent:
 *           type: string
 *           nullable: true
 *         positionX:
 *           type: number
 *         positionY:
 *           type: number
 *         width:
 *           type: number
 *         height:
 *           type: number
 *         rotation:
 *           type: number
 *         zIndex:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *   responses:
 *     ElementList:
 *       description: A list of elements.
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Element'
 *           example:
 *             - _id: "5f8d0d55b54764421b7156c1"
 *               boardId: "69245b51506e0a66ed3087ce"
 *               type: "text"
 *               contentUrl: null
 *               textContent: "Hello world"
 *               positionX: 100
 *               positionY: 200
 *               width: 300
 *               height: 100
 *               rotation: 0
 *               zIndex: 1
 *               createdAt: "2025-12-01T19:28:41.566Z"
 *     Element:
 *       description: Element object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Element'
 *           example:
 *             _id: "5f8d0d55b54764421b7156c1"
 *             boardId: "69245b51506e0a66ed3087ce"
 *             type: "text"
 *             contentUrl: null
 *             textContent: "Hello world"
 *             positionX: 100
 *             positionY: 200
 *             width: 300
 *             height: 100
 *             rotation: 0
 *             zIndex: 1
 *             createdAt: "2025-12-01T19:28:41.566Z"
 *   parameters:
 *     ElementId:
 *       in: path
 *       name: elementId
 *       required: true
 *       schema:
 *         type: string
 *       description: The element ID
 *   requestBodies:
 *     ElementBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - boardId
 *               - type
 *               - positionX
 *               - positionY
 *               - width
 *               - height
 *             properties:
 *               boardId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [text, image, video, audio, shape]
 *               contentUrl:
 *                 type: string
 *                 nullable: true
 *               textContent:
 *                 type: string
 *                 nullable: true
 *               positionX:
 *                 type: number
 *               positionY:
 *                 type: number
 *               width:
 *                 type: number
 *               height:
 *                 type: number
 *               rotation:
 *                 type: number
 *               zIndex:
 *                 type: number
 *           example:
 *             boardId: "69245b51506e0a66ed3087ce"
 *             type: "text"
 *             contentUrl: null
 *             textContent: "Hello world"
 *             positionX: 100
 *             positionY: 200
 *             width: 300
 *             height: 100
 *             rotation: 0
 *             zIndex: 1
 */

export default router;