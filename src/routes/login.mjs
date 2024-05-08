// Importer les modules nécessaires
import express from "express";
import { User } from "../db/sequelize.mjs";
import bcrypt from "bcrypt";

// Initialiser le routeur pour la page de connexion
const loginRouter = express.Router();

// Route pour la page de connexion
loginRouter.post("/", (req, res) => {
  const { username, password } = req.body;

  // Vérifier si l'utilisateur existe dans la base de données
  User.findOne({ where: { username: username } })
    .then((user) => {
      if (!user) {
        // L'utilisateur n'existe pas
        return res.status(404).json({ message: "Nom d'utilisateur incorrect" });
      }

      // Vérifier le mot de passe
      bcrypt.compare(password, user.password)
        .then((match) => {
          if (match) {
            // Le mot de passe est correct
            res.status(200).json({ message: "Connexion réussie" });
          } else {
            // Le mot de passe est incorrect
            res.status(401).json({ message: "Mot de passe incorrect" });
          }
        })
        .catch((error) => {
          // Erreur lors de la comparaison des mots de passe
          console.error("Erreur lors de la comparaison des mots de passe :", error);
          res.status(500).json({ message: "Erreur lors de la connexion" });
        });
    })
    .catch((error) => {
      // Erreur lors de la recherche de l'utilisateur dans la base de données
      console.error("Erreur lors de la recherche de l'utilisateur :", error);
      res.status(500).json({ message: "Erreur lors de la connexion" });
    });
});

// Exporter le routeur de la page de connexion
export { loginRouter };
