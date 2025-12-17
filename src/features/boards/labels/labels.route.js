import express from 'express';
import * as labelsController from './labels.controller.js';


const router = express.Router();

/**
 * @swagger
 * /labels:
 *   get:
 *     summary: Get all labels
 *     tags: [labels]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/LabelList'
 */
router.get('/', labelsController.getAllLabels);

/**
 * @swagger
 * /labels:
 *   post:
 *     summary: Create a new label
 *     tags: [labels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Label'
 *           example:
 *             name: "Urgent"
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Label'
 */
router.post('/', labelsController.createLabel);

/**
 * @swagger
 * /labels/{labelId}:
 *   delete:
 *     summary: Delete a label by ID
 *     tags: [labels]
 *     parameters:
 *       - $ref: '#/components/parameters/LabelId'
 *     responses:
 *       200:
 *         description: Label deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Label'
 *             example:
 *               _id: "5f8d0d55b54764421b7156c1"
 *               name: "Urgent"
 */
router.delete('/:labelId', labelsController.deleteLabel);

/**
 * @swagger
 * components:
 *   schemas:
 *     Label:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           maxLength: 20
 *   responses:
 *     LabelList:
 *       description: A list of labels.
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Label'
 *           example:
 *             - _id: "5f8d0d55b54764421b7156c1"
 *               name: "Urgent"
 *             - _id: "5f8d0d55b54764421b7156c2"
 *               name: "Feature"
 *     Label:
 *       description: Label object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Label'
 *           example:
 *             _id: "5f8d0d55b54764421b7156c1"
 *             name: "Urgent"
 *   parameters:
 *     LabelId:
 *       in: path
 *       name: labelId
 *       required: true
 *       schema:
 *         type: string
 *       description: The label ID
 */

export default router;