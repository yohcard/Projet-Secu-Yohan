// login.mjs

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connection from "../db/mysql.mjs";

const loginRouter = express.Router();

// Endpoint de connexion
loginRouter.post("/", (req, res) => {
  const { username, password } = req.body;

  // Affiche le corps de la requête dans la console
  console.log("Corps de la requête :", req.body);

  // Vérifier si l'utilisateur existe dans la base de données
  connection.query(
    "SELECT * FROM Users WHERE username = ?",
    [username],
    (error, results) => {
      if (error) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur:",
          error
        );
        return res.status(500).json({ error: "Erreur de serveur" });
      }

      if (results.length === 0) {
        // L'utilisateur n'existe pas
        return res
          .status(401)
          .json({ error: "Nom d'utilisateur ou mot de passe incorrect" });
      }

      const user = results[0];

      // Vérifier si le mot de passe est correct
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error(
            "Erreur lors de la comparaison des mots de passe:",
            err
          );
          return res.status(500).json({ error: "Erreur de serveur" });
        }

        if (!isMatch) {
          // Mot de passe incorrect
          return res
            .status(401)
            .json({ error: "Nom d'utilisateur ou mot de passe incorrect" });
        }

        // Si l'utilisateur et le mot de passe sont corrects, créer un token JWT
        const payload = {
          userId: user.id,
          username: user.username,
        };

        jwt.sign(
          payload,
          "yourSecretKey",
          { expiresIn: "1h" },
          (jwtError, token) => {
            if (jwtError) {
              console.error(
                "Erreur lors de la création du token JWT:",
                jwtError
              );
              return res.status(500).json({ error: "Erreur de serveur" });
            }

            // Envoi du token au client
            res.json({ token });
            localStorage.setItem("token", token);
          }
        );
      });
    }
  );
});

export { loginRouter };
