import express from 'express';
import * as usersFollow from './usersFollow.controller.js';

const router = express.Router();

router.post('/', usersFollow.createFollow);

router.delete('/:id', usersFollow.deleteFollow);

export default router;