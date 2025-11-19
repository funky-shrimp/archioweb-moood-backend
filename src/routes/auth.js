import express from "express";
import basicAuth from "../auth/auth.basicAuth.middleware.js";
import { authenticateJWT } from "../auth/JWT/auth.jwt.middleware.js";
import { createJWT } from "../auth/JWT/auth.helpers.js";

const router = express.Router();

// Protected route
router.post('/login', basicAuth, (req, res) => {
    const token = createJWT(req.user)
    res.json({ token });
});

// Protected route
router.get('/protected', authenticateJWT, (req, res) => {
    res.json({
        message: 'Protected data',
        user: req.user
    });
});


export default router;
//mettre ce qu'il faut dans le payload (a voir)