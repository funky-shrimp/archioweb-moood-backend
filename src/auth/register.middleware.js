import bcrypt from "bcrypt";
import User from "../features/socials/users/users.model.js";
import { pass } from "jest-extended";

export default async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    // Validation des champs requis
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Username, email and password required",
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Email or username already in use",
      });
    }

    /* password rule :
        at least 8 characters, one uppercase, one lowercase, one number, one special character.
        e.g : Sausage6!
      */
    const passwordValidity =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
        password
      );


    if (!passwordValidity) {
      return res.status(400).json({
        error: "Password is not valid",
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
      createdAt: new Date(),
    });

    // Sauvegarder l'utilisateur
    await newUser.save();

    req.user = newUser.toObject();
    delete req.user.password;
    next();
  } catch (error) {
    //console.error("Erreur lors de l'enregistrement:", error);
    res.status(500).json({
      error: "Error registering user",
    });
  }
}
