// profileRouter.js
import express from "express";
import { User } from "../db/sequelize.mjs";
import bcrypt from "bcrypt";

const profileRouter = express.Router();

profileRouter.get("/user/:name", (req, res, next) => { // Utilisation de req.params pour récupérer le nom
  const { name } = req.params;
  const { username, password } = req.body;

  // Vérifier si le nom d'utilisateur et le mot de passe sont fournis dans le corps de la requête
  if (!username || !password) {
    return res.status(400).json({ message: "Nom d'utilisateur ou mot de passe manquant dans le corps de la requête." });
  }

  // Récupérer l'utilisateur à partir de la base de données en utilisant le nom d'utilisateur fourni
  User.findOne({ where: { username: name } })
    .then((user) => {
      if (!user) {
        // Si l'utilisateur n'est pas trouvé, renvoyer une réponse d'erreur
        return res.status(404).json({ message: "Nom d'utilisateur incorrect." });
      }

      // Comparer le mot de passe fourni avec le mot de passe stocké dans la base de données
      bcrypt.compare(password, user.password)
        .then((match) => {
          if (match) {
            // Si les mots de passe correspondent, l'utilisateur est authentifié
            // Ajouter les informations de l'utilisateur à la réponse JSON
            const userData = {
              id: user.id,
              username: user.username,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              age: user.age,
              country: user.country
            };            
            res.json(userData); // Envoyer uniquement les informations de l'utilisateur dans la réponse JSON
          } else {
            // Si les mots de passe ne correspondent pas, renvoyer une réponse d'erreur
            res.status(401).json({ message: "Mot de passe incorrect." });
          }
        })
        .catch(next); // Passer l'erreur au middleware d'erreur global
    })
    .catch(next); // Passer l'erreur au middleware d'erreur global
});

export { profileRouter };
