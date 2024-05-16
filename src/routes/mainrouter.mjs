// mainrouter.mjs

import express from "express";
import jwt from "jsonwebtoken";
import connection from "../db/mysql.mjs";

const router = express.Router();

router.get("/user", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  jwt.verify(token, "yourSecretKey", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const userId = decoded.userId;

    connection.query(
      "SELECT * FROM Users WHERE id = ?",
      [userId],
      (error, results) => {
        if (error) {
          return res.status(500).json({ error: "Server error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        const user = results[0];
        res.json(user); // Send the user data as JSON
      }
    );
  });
});

export { router };
