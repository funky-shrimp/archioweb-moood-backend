import * as dotenv from "dotenv";

dotenv.config({quiet:true});

// Port de connection à l'APP
export const port = process.env.PORT || 3000;

// URL de la base de données
export const database_url = process.env.DATABASE_URL || "mongdb://localhost/your-app-name";
export const jwt_secret = process.env.JWT_SECRET || "your-secret-key";

export const origin_frontend = process.env.ORIGIN_FRONTEND || "http://localhost:3000";