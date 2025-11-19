import jwt from "jsonwebtoken";
import {jwt_secret} from "../../../config.js";

function createJWT(user) {
    const payload = {
        sub: user._id.toString(),
        username: user.username,
        role: user.role
    };
    return jwt.sign(payload, jwt_secret || 'dev-secret', { expiresIn: '7d' }); //token
}

export { createJWT };