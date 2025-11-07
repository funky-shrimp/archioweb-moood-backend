import * as dotenv from "dotenv";

dotenv.config();

// Port de connection à l'APP
export const port = process.env.PORT || 3000;

// URL de la base de données
export const database_url = process.env.DATABASE_URL || "mongdb://localhost/your-app-name";