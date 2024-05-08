// sequelize.js
import pkgSequelize from "sequelize";
import bcrypt from "bcrypt";
import { mockUsers } from "./mock.mjs"; // Correction de l'extension de fichier
import { UserModel } from "../models/models.mjs"; // Correction de l'extension de fichier

const { Sequelize, DataTypes } = pkgSequelize;

const sequelize = new Sequelize("db_products", "root", "root", {
  host: "localhost",
  port: 6033,
  dialect: "mysql",
  logging: false,
});

const User = UserModel(sequelize, DataTypes);

const initDb = async () => {
  try {
    // Utilisation de l'opérateur await pour s'assurer que la connexion est établie avant de continuer
    await sequelize.authenticate();
    console.log("La connexion à la base de données a bien été établie");

    // Utilisation de sequelize.sync({ force: true }) pour synchroniser les modèles avec la base de données
    await sequelize.sync({ force: true });
    await importUsers();
    console.log("La base de données db_products a bien été synchronisée");
  } catch (error) {
    // Utilisation de console.error pour les erreurs
    console.error("Erreur lors de la synchronisation de la base de données :", error);
  }
};

const importUsers = async () => {
  try {
    for (const mockUser of mockUsers) {
      const hash = await bcrypt.hash(mockUser.password, 10);
      // Utilisation de User.create() pour créer un nouvel utilisateur dans la base de données
      await User.create({
        username: mockUser.username,
        password: hash,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        age: mockUser.age,
        country: mockUser.country,
      });
    }
  } catch (error) {
    // Utilisation de console.error pour les erreurs
    console.error("Erreur lors de l'importation des utilisateurs :", error);
  }
};

// Exportation des éléments nécessaires
export { sequelize, initDb, User, DataTypes };
