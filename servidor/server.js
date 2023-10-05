const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: process.env.PORT,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    connectionString: process.env.DB_URL,
    allowExitOnIdle: true
});

module.exports = pool;
