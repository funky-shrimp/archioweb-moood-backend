import express from "express";
import basicAuth from "./auth.basicAuth.middleware.js";
import { authenticateJWT } from "./JWT/auth.jwt.middleware.js";
import { createJWT } from "./JWT/auth.helpers.js";
import register from "./register.middleware.js";

const router = express.Router();

// Login
router.post('/login', basicAuth, (req, res) => {
    const token = createJWT(req.user)
    res.json({ token });
});

// Protected route (middle ware a mettre sur les routes a proteger)
router.get('/protected', authenticateJWT, (req, res) => {
    res.json({
        message: 'Protected data',
        user: req.user
    });
});

// Register
router.post('/register',register, (req, res) => {
    res.status(201).json({
            message: "Utilisateur créé avec succès",
            user: req.user
        });
});


export {router as auth};
//mettre ce qu'il faut dans le payload (a voir)