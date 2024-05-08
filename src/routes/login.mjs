import express from "express";
import session from "express-session";
import { User } from "../db/sequelize.mjs";
import bcrypt from "bcrypt";

const app = express();

// Configuration de express-session
app.use(session({
  secret: 'b$Q8GkmFzT9n3D!pXY*Wu5R7jc@LV2qS',
  resave: false,
  saveUninitialized: true
}));

const loginRouter = express.Router();

loginRouter.post("/", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ where: { username: username } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Nom d'utilisateur incorrect" });
      }

      bcrypt.compare(password, user.password)
        .then((match) => {
          if (match) {
            // Créer une session utilisateur
            req.session.user = user;

            res.status(200).json({ message: "Connexion réussie" });
          } else {
            res.status(401).json({ message: "Mot de passe incorrect" });
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la comparaison des mots de passe :", error);
          res.status(500).json({ message: "Erreur lors de la connexion" });
        });
    })
    .catch((error) => {
      console.error("Erreur lors de la recherche de l'utilisateur :", error);
      res.status(500).json({ message: "Erreur lors de la connexion" });
    });
});

app.use("/login", loginRouter);

app.listen(443, () => {
  console.log("Serveur démarré sur le port 443");
});

export { loginRouter };
