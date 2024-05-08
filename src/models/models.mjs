import { sequelize, DataTypes } from "../db/sequelize.mjs"; // Assurez-vous que le chemin d'accès est correct

const UserModel = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  });
};

const ProductModel = (sequelize, DataTypes) => {
  return sequelize.define("Product", {
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    created: DataTypes.DATE,
  });
};

export { UserModel, ProductModel };