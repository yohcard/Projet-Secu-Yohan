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
const port = 443;

const httpsOptions = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

const corsOptions = {
  origin: "https://localhost:443",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connection.connect((error) => {
  if (error) {
    console.error("Impossible de se connecter à la DB:", error);
  } else {
    console.log("Connected to DB");

    app.use("/login", loginRouter);
    app.use("/users", router);

    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "formulaire_login.html"));
    });

    app.get("/page-d'acceuil.html", (req, res) => {
      res.sendFile(path.join(__dirname, "page-d'acceuil.html")); // Page d'accueil
    });

    https.createServer(httpsOptions, app).listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  }
});
