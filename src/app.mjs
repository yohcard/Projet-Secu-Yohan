import express from "express";
import https from "node:https";
import fs from "fs";
import mysql from "mysql2";
import { router } from "./routes/mainrouter.mjs";
import { loginRouter } from "./routes/login.mjs";
import connection from "./db/mysql.mjs";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 1234;

const httpsOptions = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

const corsOptions = {
  origin: "https://localhost:1234",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à la base de données MySQL
connection.connect((error) => {
  if (error) {
    console.error("Impossible de se connecter à la DB:", error);
  } else {
    // Routes
    app.use("/login", loginRouter);
    app.use("/router", router);

    // Route par défaut pour servir le fichier HTML
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "formulaire_login.html"));
    });

    // Utilisation de HTTPS pour démarrer le serveur
    https.createServer(httpsOptions, app).listen(port);
  }
});
