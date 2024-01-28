"use strict";
/** Database setup for dnd_game. */

const { Pool } = require('pg');
require("dotenv").config(); 


let db = new Pool({
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

module.exports = db;