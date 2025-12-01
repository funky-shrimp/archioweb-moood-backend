import jwt from "jsonwebtoken";
import {jwt_secret} from "../../../config.js";

// JWT authentication middleware
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, jwt_secret || 'dev-secret');

        req.user = {
            id: decoded.sub,
            username: decoded.username,
            role: decoded.role || 'user'
        };
        next();
    } catch (err) {
        console.error('JWT verify error:', err.message);
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}

export { authenticateJWT };