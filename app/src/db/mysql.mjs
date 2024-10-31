import mysql from "mysql2";
import fs from 'fs';

const connection = mysql.createConnection({
    host: '172.20.0.2',
    user: 'root',
    password: 'root',
    database: 'db_products',
    port: 3306,
});

/*const filePath = '../Passeport_modeleOnLine2024 (1).dotx';
const fileContent = fs.readFileSync(filePath);

// Insérer le fichier dans la base de données
connection.query(
  'INSERT INTO fichiers (nom, contenu) VALUES (?, ?)',
  ['Passeport_modeleOnLine2024 (1).dotx', fileContent],
  (error, results) => {
    if (error) throw error;
    console.log('File inserted with ID:', results.insertId);
  }
);*/

export default connection;
