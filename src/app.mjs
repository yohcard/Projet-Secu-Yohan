import express from "express";
import { sequelize, initDb } from "./db/sequelize.mjs";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.mjs";
import { loginRouter } from "./routes/login.mjs";
import { router } from "./routes/mainrouter.mjs"


const app = express();
const port = 3000;

app.use(express.json());

// Initialisation de la connexion à la base de données
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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.use("/api/login", loginRouter);
app.use("/router", router);
// Route par défaut
app.get("/", (req, res) => {
  res.send("web_app");
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`L'application écoute sur le port ${port}`);
});