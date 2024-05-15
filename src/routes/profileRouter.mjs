import express from "express";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import { privateKey } from "../auth/private_key.mjs";
import connection from "../db/mysql.mjs"; // Import de votre fichier de connexion MySQL

const profileRouter = express.Router();

// Middleware pour vérifier le jeton JWT dans la requête
const auth = (req, res, next) => {
  // Récupérer le jeton JWT de l'en-tête Authorization
  const token = req.headers.authorization;

  // Vérifier si le jeton JWT est présent
  if (!token) {
    return res.status(401).json({ message: "Token d'authentification manquant." });
  }

  // Vérifier et décoder le jeton JWT
  jwt.verify(token, privateKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token d'authentification invalide." });
    } else {
      // Stocker les informations de l'utilisateur dans l'objet de requête pour une utilisation ultérieure
      req.user = decoded;
      next(); // Passer au middleware suivant
    }
  });
};

// Route pour accéder au profil de l'utilisateur
profileRouter.get("/user", auth, async (req, res, next) => {
  try {
    // Récupérer l'ID de l'utilisateur à partir des informations stockées dans le jeton JWT
    const userId = req.user.userId;

    // Exécuter la requête SQL pour récupérer les informations de l'utilisateur
    const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);

    // Vérifier si l'utilisateur existe
    if (rows.length === 0) {
      // Si l'utilisateur n'est pas trouvé, renvoyer une réponse d'erreur
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Récupérer les informations de l'utilisateur depuis la première ligne de résultats
    const user = rows[0];

    // Envoyer les informations de l'utilisateur dans la réponse JSON
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      country: user.country
    };

    res.json(userData); // Envoyer uniquement les informations de l'utilisateur dans la réponse JSON
  } catch (error) {
    next(error); // Passer l'erreur au middleware d'erreur global
  }
});

export { profileRouter };
