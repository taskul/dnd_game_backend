"use strict";
/** Database setup for dnd_game. */

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

db = new Client({
    connectionString: getDatabaseUri()
})
db.connect();



module.exports = db;