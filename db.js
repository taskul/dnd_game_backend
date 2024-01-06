"use strict";
/** Database setup for dnd_game. */

const { Client } = require("pg");
// const { getDatabaseUri } = require("./config");

let db;
require("dotenv").config(); // testing client

// use getDatabaseUri() when testing
// because render.com did not work with a db connection string
// db = new Client({
//     connectionString: getDatabaseUri()
// })
// db.connect();

db = new Client({
    user: process.env.DB_USERNAME,
    host: process.env.HOST,
    database: process.env.DB_NAME,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        sslmode: 'require',
    },
})

db.connect()
    .then(() => console.log('Connected to the database'))
    .catch((err) => console.error('Error connecting to the database', err));

module.exports = db;