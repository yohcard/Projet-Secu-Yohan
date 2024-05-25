-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : db:3306
-- Généré le : mar. 21 mai 2024 à 20:28
-- Version du serveur : 8.0.30
-- Version de PHP : 8.0.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `db_products`
--

-- --------------------------------------------------------

--
-- Structure de la table `Users`
--

CREATE TABLE `Users` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL, -- Ajout de la colonne 'salt'
  `email` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `age` int NOT NULL,
  `country` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `role` varchar(255) DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `Users`
--

-- Suppression des anciens utilisateurs pour réinsérer avec les nouvelles valeurs de 'password' et 'salt'
DELETE FROM `Users` WHERE `id` IN (1, 2);

-- Réinsertion des utilisateurs avec 'password' et 'salt' hachés
INSERT INTO Users (id, username, password, salt, email, firstName, lastName, age, country, createdAt, updatedAt, role) VALUES (1, 'user1', '58a9215b3d4d0da808ddbe1ebe2f007943305fd0c646f22e3d6dc912fc981440cd0757ff0e10660abe042a0b323490992ec92e0eafa7ad4cfaab080cf0c113dd', 'abcd3ce1a5e0f79490e17dece1e0053c', 'user1@example.com', 'ben', 'ten', 30, 'suisse', '2024-05-15 17:20:00', '2024-05-15 17:20:00', 'admin');
INSERT INTO Users (id, username, password, salt, email, firstName, lastName, age, country, createdAt, updatedAt, role) VALUES (2, 'user2', 'f1d2b4b2d25f6e0e55e3f870c0f79cd7866d6b2fd74e363e6758cd79a4127f87ff5fda8c742c66d232750d45c49e650936dd345f5fcace9b196a9d169b2c0e1a', 'e9ba2a19098b99a7f39419b6e28cb42b', 'user2@example.com', 'scooby', 'doo', 30, 'france', '2024-05-15 17:20:00', '2024-05-15 17:20:00', 'user');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
