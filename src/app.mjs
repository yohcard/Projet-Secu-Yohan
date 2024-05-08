// server.js
import express from "express";
import { router } from "./routes/mainrouter.mjs"; // Correction du chemin d'importation
import { profileRouter } from "./routes/profileRouter.mjs"; // Correction du chemin d'importation
import { loginRouter } from "./routes/login.mjs"; // Correction du chemin d'importation
import { sequelize, initDb } from "./db/sequelize.mjs";

const app = express();
const port = 1234;

app.use(express.json());

sequelize
  .authenticate()
  .then(() => {
    console.log("La connexion à la base de données a bien été établie");
    initDb();
  })
  .catch((error) =>
    console.error("Impossible de se connecter à la DB:", error)
  );

// Routes
app.use("/api/login", loginRouter);
app.use("/router", router);
app.use("/profile", profileRouter );

// Route par défaut
app.get("/", (req, res) => {
  res.send("web_app");
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`L'application écoute sur le port ${port}`);
});
