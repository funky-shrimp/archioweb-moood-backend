import express from 'express';
import * as labelsController from './labels.controller.js';

const router = express.Router();

router.get('/', labelsController.getAllLabels);
router.post('/', labelsController.createLabel);
router.delete('/:labelId', labelsController.deleteLabel);

export default router;