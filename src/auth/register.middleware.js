import bcrypt from "bcrypt";
import User from "../features/socials/users/users.model.js";

export default async function register(req, res, next) {
    try {
        const { username, email, password } = req.body;

        // Validation des champs requis
        if (!username || !email || !password) {
            return res.status(400).json({
                error: "Username, email et password sont requis"
            });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(409).json({
                error: "Cet email ou username est déjà utilisé"
            });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer le nouvel utilisateur
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            avatarUrl: "",
            bio: "",
            role: "user",
            createdAt: new Date()
        });

        // Sauvegarder l'utilisateur
        await newUser.save();

        req.user = newUser.toObject();
        delete req.user.password;
        next();

    } catch (error) {
        console.error("Erreur lors de l'enregistrement:", error);
        res.status(500).json({
            error: "Erreur serveur lors de la création du compte"
        });
    }
}