"use strict";
/** Database setup for dnd_game. */

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;
require("dotenv").config(); // testing client

// use getDatabaseUri() when testing
// because render.com did not work with a db connection string
// db = new Client({
//     connectionString: getDatabaseUri()
// })
// db.connect();

db = new Client({
    user: process.env.USERNAME,
    host: process.env.HOST,
    database: process.env.DB_NAME,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT,
})

db.connect();


module.exports = db;