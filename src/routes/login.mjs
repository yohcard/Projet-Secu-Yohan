import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import connection from "../db/mysql.mjs";

const loginRouter = express.Router();

loginRouter.post("/", (req, res) => {
  const { username, password } = req.body;

  const regex = /^[a-zA-Z0-9]+$/;

  if (!regex.test(username) || !regex.test(password)) {
    return res.status(400).json({
      error: "Username et Password ne doivent contenir que des lettres et des chiffres.",
    });
  }

  // vérifie si le user existe dans la db
  connection.query(
    "SELECT * FROM Users WHERE username = ?",
    [username],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Server error" });
      }

      if (results.length === 0) {
        // User n'existe pas
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const user = results[0];

      // vérifie si le password est correct
      const hashPassword = (password, salt) => {
        return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
      };

      const hash = hashPassword(password, user.salt);

      if (hash !== user.password) {
        // password incorrect
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // si le user et le password sont corrects, création du token JWT
      const payload = {
        userId: user.id,
        username: user.username,
        role: user.role, // inclut le rôle de l'utilisateur
      };

      jwt.sign(
        payload,
        "yourSecretKey",
        { expiresIn: "1h" },
        (jwtError, token) => {
          if (jwtError) {
            return res.status(500).json({ error: "Server error" });
          }

          // envoi du token au client
          res.json({ token });
        }
      );
    }
  );
});

export { loginRouter };
