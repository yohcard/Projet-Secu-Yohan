// login.mjs

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connection from "../db/mysql.mjs";

const loginRouter = express.Router();

// Endpoint de connexion
loginRouter.post("/", (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists in the database
  connection.query(
    "SELECT * FROM Users WHERE username = ?",
    [username],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Server error" });
      }

      if (results.length === 0) {
        // User does not exist
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const user = results[0];

      // Check if the password is correct
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ error: "Server error" });
        }

        if (!isMatch) {
          // Incorrect password
          return res
            .status(401)
            .json({ error: "Invalid username or password" });
        }

        // User and password are correct, create a JWT token
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

            // Send the token to the client
            res.json({ token });
          }
        );
      });
    }
  );
});

export { loginRouter };
