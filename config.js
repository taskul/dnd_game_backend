"use strict"

/** Shared config for application; can be required many places. */

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "dloea031ladfakd#Dx*7D4!hM82P@xtZ8uW";

const PORT = +process.env.PORT || 3001;
const DB_USER = process.env.USERNAME;
const DB_PASS = process.env.PASSWORD;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? `postgresql://${DB_USER}:${DB_PASS}@localhost:5432/dnd_game_test`
        : process.env.DATABASE_URL || `postgresql://${DB_USER}:${DB_PASS}@localhost:5432/dnd_game`
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri
}