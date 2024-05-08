// Importer les modules nécessaires
import express from "express";
import { Product } from "../db/sequelize.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { User } from "../db/sequelize.mjs";
import bcrypt from "bcrypt";


// Initialiser le routeur pour les produits
const router = express();

/**
* @swagger
* /api/products/:
* get:
* tags: [Products]
* security:
* - bearerAuth: []
* summary: Retrieve all products.
* description: Retrieve all products. Can be used to populate a select HTML tag.
* responses:
* 200:
* description: All products.
* content:
* application/json:
* schema:
* type: object
* properties:
* data:
* type: object
* properties:
* id:
* type: integer
* description: The product ID.
* example: 1
* name:
* type: string
* description: The product's name.
* example: Big Mac
* price:
* type: number
* description: The product's price.
* example: 5.99
*
*/


router.get("/user/:name", (req, res) => {
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
              email: user.email, // Ajoutez d'autres informations d'utilisateur si nécessaire
            };
            res.json(userData); // Envoyer uniquement les informations de l'utilisateur dans la réponse JSON
          } else {
            // Si les mots de passe ne correspondent pas, renvoyer une réponse d'erreur
            res.status(401).json({ message: "Mot de passe incorrect." });
          }
        })
        .catch((error) => {
          // En cas d'erreur lors de la comparaison des mots de passe, renvoyer une réponse d'erreur
          console.error("Erreur lors de la comparaison des mots de passe :", error);
          res.status(500).json({ message: "Erreur lors de la connexion." });
        });
    })
});









// Exporter le routeur des produits
export { router };
