// sequelize.mjs
import pkgSequelize from "sequelize";
const { Sequelize, DataTypes } = pkgSequelize;


import bcrypt from "bcrypt";
import { mockUsers } from "./mock.mjs"; // Importez mockUsers depuis le fichier mock.mjs
import { UserModel, ProductModel } from "../models/models.mjs"; // Assurez-vous que le chemin d'accès est correct

const sequelize = new Sequelize("db_products", "root", "root", {
  host: "localhost",
  port: 6033,
  dialect: "mysql",
  logging: false,
});

const User = UserModel(sequelize, DataTypes);
const Product = ProductModel(sequelize, DataTypes); // Ajout de ProductModel ici

const initDb = () => {
  return sequelize
    .sync({ force: true })
    .then((_) => {
      //importProducts();
      importUsers();
      console.log("La base de données db_products a bien été synchronisée");
    });
};

/*const importProducts = () => {
  products.map((product) => {
    Product.create({
      name: product.name,
      price: product.price,
    }).then((product) => console.log(product.toJSON()));
  });
};*/

const importUsers = () => {
  // Utilisez mockUsers pour initialiser les utilisateurs
  mockUsers.map((mockUser) => {
    bcrypt
      .hash(mockUser.password, 10)
      .then((hash) =>
        User.create({
          username: mockUser.username,
          password: hash,
        })
      )
      .then((user) => console.log(user.toJSON()));
  });
};

export { sequelize, initDb, Product, User,DataTypes  };
