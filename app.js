"use strict"

// Express app for Dungeon and Dragons

const express = require('express');
const cors = require('cors');

const { NotFoundError } = require('./expressError');

const { authenticateJWT } = require('./middleware/auth');
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const mapRoutes = require('./routes/maps');
const guildRoutes = require('./routes/guilds')

const morgan = require("morgan");

// need this for specifying location of React build files
const path = __dirname + "/views/";

const app = express();

// need this for specifying location of React build files
app.use(express.static(path));

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

// specifying this for react files
app.get('/', function (req, res) {
    res.sendFile(path + "index.html");
});

// routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use('/maps', mapRoutes);
app.use('/guilds', guildRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== 'test') console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

module.exports = app;