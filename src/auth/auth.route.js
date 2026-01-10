
import express from "express";
import basicAuth from "./auth.basicAuth.middleware.js";
import { authenticateJWT } from "./JWT/auth.jwt.middleware.js";
import { createJWT } from "./JWT/auth.helpers.js";
import register from "./register.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: auth
 *     description: All APIs related to /auth/ endpoints.
 *
 * components:
 *   schemas:
 *     AuthLoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: "JohnDoe"
 *         password:
 *           type: string
 *           example: "Password123!"
 *     AuthLoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     AuthRegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: "JohnDoe"
 *         email:
 *           type: string
 *           example: "john.doe@email.com"
 *         password:
 *           type: string
 *           example: "Password123!"
 *     AuthRegisterResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "User created successfully"
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "60c72b2f9b1e8e001c8e4b8a"
 *             username:
 *               type: string
 *               example: "JohnDoe"
 *             email:
 *               type: string
 *               example: "john.doe@email.com"
 *             avatarUrl:
 *               type: string
 *               example: ""
 *             bio:
 *               type: string
 *               example: "Hello, I'm John!"
 *             role:
 *               type: string
 *               example: "user"
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: "2024-01-01T12:00:00.000Z"
 *     AuthProtectedResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Protected data"
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "60c72b2f9b1e8e001c8e4b8a"
 *             username:
 *               type: string
 *               example: "JohnDoe"
 *             role:
 *               type: string
 *               example: "user"
 *   responses:
 *     UnauthorizedError:
 *       description: Authentication required or failed
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Authentication required"
 *     ConflictError:
 *       description: Email or username already used
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Email or username already in use"
 *     ServerError:
 *       description: Server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Error creating user"
 *
 *   requestBodies:
 *     AuthLogin:
 *       description: User credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginRequest'
 *     AuthRegister:
 *       description: User registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegisterRequest'
*/


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [auth]
 *     requestBody:
 *       $ref: '#/components/requestBodies/AuthLogin'
 *     responses:
 *       200:
 *         description: JWT token returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthLoginResponse'
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/login', basicAuth, (req, res) => {
    const token = createJWT(req.user)
    res.json({ token });
});


/**
 * @swagger
 * /auth/protected:
 *   get:
 *     summary: Access protected resource
 *     tags: [auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Protected data returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthProtectedResponse'
 *             example:
 *               message: "Protected data"
 *               user:
 *                 id: "60c72b2f9b1e8e001c8e4b8a"
 *                 username: "JohnDoe"
 *                 role: "user"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/protected', authenticateJWT, (req, res) => {
    res.json({
        message: 'Protected data',
        user: req.user
    });
});


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [auth]
 *     requestBody:
 *       $ref: '#/components/requestBodies/AuthRegister'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthRegisterResponse'
 *             example:
 *               message: "Utilisateur créé avec succès"
 *               user:
 *                 _id: "60c72b2f9b1e8e001c8e4b8a"
 *                 username: "JohnDoe"
 *                 email: "john.doe@email.com"
 *                 avatarUrl: ""
 *                 bio: "Hello, I'm John!"
 *                 role: "user"
 *                 createdAt: "2024-01-01T12:00:00.000Z"
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Username, email et password sont requis"
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/register',register, (req, res) => {
    res.status(201).json({
            message: "Utilisateur créé avec succès",
            user: req.user
        });
});


export {router as auth};
