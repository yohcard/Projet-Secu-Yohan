// mainrouter.mjs

import express from "express";
import jwt from "jsonwebtoken";
import connection from "../db/mysql.mjs";

const router = express.Router();

// Middleware de vérification du token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }

  jwt.verify(token.split(" ")[1], "yourSecretKey", (err, decoded) => {
    if (err) {
      console.error("Erreur lors de la vérification du token JWT:", err);
      return res.status(403).json({ error: "Token invalide" });
    }

    req.userData = decoded;
    next();
  });
};

// Route protégée nécessitant un token JWT valide
router.get("/user", verifyToken, (req, res) => {
  // Une fois le token vérifié, vous pouvez utiliser les données de l'utilisateur dans req.userData
  const userId = req.userData.userId;

  // Récupérer les données de l'utilisateur depuis la base de données
  connection.query(
    "SELECT id, username, email, firstName, lastName, age, country FROM Users WHERE id = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error(
          "Erreur lors de la récupération des données de l'utilisateur:",
          error
        );
        return res.status(500).json({ error: "Erreur de serveur" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      const userData = results[0];
      // Renvoyer les données de l'utilisateur
      res.json(userData);
    }
  );
});

export { router };
