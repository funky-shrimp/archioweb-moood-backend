import express from 'express';
import * as usersController from './users.controller';

const router = express.Router();

router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);

export default router;