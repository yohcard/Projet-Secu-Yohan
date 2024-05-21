// login.mjs

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connection from "../db/mysql.mjs";

const loginRouter = express.Router();

loginRouter.post("/", (req, res) => {
  const { username, password } = req.body;

  const regex = /^[a-zA-Z0-9]+$/;

  if (!regex.test(username) || !regex.test(password)) {
    return res
      .status(400)
      .json({
        error:
          "Username et Password ne doivent contenir que des lettres et des chiffres.",
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
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ error: "Server error" });
        }

        if (!isMatch) {
          //  password incorrect
          return res
            .status(401)
            .json({ error: "Invalid username or password" });
        }

        // si le user et le password sont correct, ceation du token JWT
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
              return res.status(500).json({ error: "Server error" });
            }

            // evoie du token au client
            res.json({ token });
          }
        );
      });
    }
  );
});

export { loginRouter };
