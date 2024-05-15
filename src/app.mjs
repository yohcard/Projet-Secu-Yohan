import express from "express";
import https from "node:https";
import fs from "fs";
import mysql from "mysql2";
import { router } from "./routes/mainrouter.mjs";
import { profileRouter } from "./routes/profileRouter.mjs";
import { loginRouter } from "./routes/login.mjs";
import connection from "./db/mysql.mjs";

const app = express();
const port = 1234;

const httpsOptions = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

app.use(express.json());

// Connexion à la base de données MySQL
connection.connect((error) => {
  if (error) {
    console.error("Impossible de se connecter à la DB:", error);
  } else {
    console.log("La connexion à la base de données a bien été établie");

    // Routes
    app.use("/login", loginRouter);
    app.use("/router", router);
    app.use("/profile", profileRouter);

    // Route par défaut pour servir le fichier HTML
    app.get("/", (req, res) => {
      res.sendFile(__dirname + './formulaire_login.html');
    });

    // Utilisation de HTTPS pour démarrer le serveur
    https.createServer(httpsOptions, app).listen(port, () => {
      console.log(`L'application écoute sur le port ${port} en utilisant HTTPS`);
    });
  }
});
