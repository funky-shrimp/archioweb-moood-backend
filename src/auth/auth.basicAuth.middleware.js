import bcrypt from "bcrypt";
import User from "../features/socials/users/users.model.js";

// Basic Auth middleware
export default async function basicAuth(req, res, next) {
    // Check for Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.set('WWW-Authenticate', 'Basic realm="Protected Area"');
        return res.status(401).send('Authentication required');
    }

    // Decode credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
    const [username, password] = credentials.split(':');

    // Validate credentials 
    const user = await User.findOne({ username: username });
    if (!user) {
        res.set('WWW-Authenticate', 'Basic realm="Protected Area"');
        return res.status(401).send('User not found');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        res.set('WWW-Authenticate', 'Basic realm="Protected Area"');
        return res.status(401).send('Invalid authentication credentials');
    }
    // Login is valid. Expose user to next handlers as plain JSON (no password)
    req.user = user.toObject();
    delete req.user.password;
    next();
}