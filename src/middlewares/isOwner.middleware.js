import User from "../features/socials/users/users.model.js";

export default function isOwner(req, res, next) {
    const requestUser = req.user;

    // Vérifier que l'utilisateur est authentifié (défini par authenticateJWT)
    if (!requestUser) {
        return res.status(401).json({ 
            error: "Authentification requise" 
        });
    }

    // Récupérer l'ID de la ressource depuis les paramètres
    const resourceOwnerId = req.params.userId || req.body.userId;

    // Vérifier si l'utilisateur est propriétaire ou admin
    const isOwner = requestUser._id.toString() === resourceOwnerId.toString();
    const isAdmin = requestUser.role === "admin";
    console.log("isOwner:", isOwner, "isAdmin:", isAdmin);

    if (!isOwner && !isAdmin) {
        return res.status(403).json({ 
            error: "Vous n'avez pas les permissions pour effectuer cette action" 
        });
    }

    next();
}