"use strict";
/** Database setup for dnd_game. */

const { Client } = require("pg");
// const { getDatabaseUri } = require("./config");
const { Pool } = require('pg');
let db;
require("dotenv").config(); // testing client

db = new Client({
    user: process.env.DB_USERNAME,
    host: process.env.HOST,
    database: process.env.DB_NAME,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT,
})

db.connect()

module.exports = db;