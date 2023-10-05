require("dotenv").config();
const pgp = require('pg-promise')()

const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.PORT
};
const db = pgp(dbConfig);

db.connect()
    .then(obj => {
        // Conexión exitosa a la base de datos
        obj.done(); // Liberar la conexión
        console.log('Conexión exitosa a la base de datos.');
    })
    .catch(error => {
        // Error al conectar a la base de datos
        console.error('Error al conectar a la base de datos:', error);
    });
