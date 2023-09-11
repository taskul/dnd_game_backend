"use strict"

// Express app for Dungeon and Dragons

const express = require('express');
const cors = require('cors');

const { NotFoundError } = require('./expressError');

const { authenticateJWT } = require('./middleware/auth');
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const mapRoutes = require('./routes/maps');
const guildRoutes = require('./routes/guilds');
const campaignRoutes = require('./routes/campaigns');
const characterRoutes = require('./routes/characters');
const gameRoutes = require('./routes/messages')

const morgan = require("morgan");

// need this for specifying location of React build files
const path = __dirname + "/views/";

const app = express();

// socket io
const http = require('http').Server(app);
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});


// need this for specifying location of React build files
app.use(express.static(path));

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);


// ...

const users = {};

socketIO.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
        // Remove the user from the list of users when they disconnect
        delete users[socket.id];
        socketIO.emit('user disconnected', users);
    });

    socket.on('chat message', (data) => {
        // Include the username with the message
        const message = { username: users[socket.id], text: data.message };
        socketIO.emit('chat message', message);
    });

    socket.on('set username', (username) => {
        // Set the username for the user
        users[socket.id] = username;
        socketIO.emit('user connected', users);
    });
});


// specifying this for react files
app.get('/', function (req, res) {
    res.sendFile(path + "index.html");
});

// routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use('/maps', mapRoutes);
app.use('/guilds', guildRoutes);
app.use('/campaigns', campaignRoutes);
app.use('/characters', characterRoutes);
app.use('/game', gameRoutes);

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

module.exports = { http, socketIO };
