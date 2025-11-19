import express from 'express';
import * as elementsController from './elements.controller.js';

const router = express.Router();

router.post('/', elementsController.createElement);
router.put('/:elementId', elementsController.updateElement);
router.delete('/:elementId', elementsController.deleteElement);

export default router;