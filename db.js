"use strict";
/** Database setup for dnd_game. */

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;
require("dotenv").config(); // testing client

// db = new Client({
//     connectionString: getDatabaseUri()
// })
// db.connect();

db = new Client({
    user: process.env.USERNAME,
    host: 'localhost',
    database: 'dnd_game',
    password: process.env.PASSWORD,
    port: 5432,
})

db.connect();


module.exports = db;