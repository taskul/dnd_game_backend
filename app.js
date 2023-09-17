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
        origin: '*',
    }
});

// const corsOptions = {
//     origin: ['http://localhost:3000', 'https://dnd-game.onrender.com/'],
//     methods: ["GET", "POST"],
//     credentials: true, // Enable cookies or authorization headers
// };



// need this for specifying location of React build files
app.use(express.static(path));

// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://dnd-game.onrender.com');
    // Add other necessary CORS headers like methods and headers here if needed.
    next();
});



// ...

const users = {};
const rooms = {};

socketIO.on('connection', (socket) => {
    console.log('A user connected');

    // will be used to update chat when user leaves or connections drops
    // Store a timeout reference for each user
    // let userTimeout;

    // Function to remove a user when they become inactive
    const removeInactiveUser = () => {
        // clearTimeout(userTimeout);
        const user = users[socket.id];

        if (user) {
            const { username, room } = user;
            // Remove the user from the list of users in the specific room
            if (rooms[room]) {
                rooms[room] = rooms[room].filter((u) => u !== username);
                socketIO.to(room).emit('user disconnected', rooms[room]);
            }
            delete users[socket.id];
        }
    };

    socket.on('disconnect', () => {
        console.log('User disconnected');
        removeInactiveUser();
    });

    socket.on('chat message', (data) => {
        const { message, username, room } = data;
        // Include the username with the message
        // const message = { username, text: data.message };
        // socketIO.emit('chat message', message);
        socketIO.to(room).emit('chat message', { message, username });
    });
    socket.on('set username', (data) => {
        const { username, room } = data;
        // Set the username and room for the user
        users[socket.id] = { username, room };
        socket.join(room); // Join the specified room
        // Add the user to the list of users in the specific room
        if (!rooms[room]) {
            rooms[room] = [username];
        } else if (!rooms[room].includes(username)) {
            // avoid duplicates of the same user in the chat room
            rooms[room].push(username);
        }
        socketIO.to(room).emit('user connected', rooms[room]);

        // Set a timeout for user inactivity (e.g., 5 minutes)
        // userTimeout = setTimeout(() => {
        //     removeInactiveUser();
        // }, 5 * 60 * 1000); // 5 minutes in milliseconds
    });

    socket.on('get map', (data) => {
        const { map_id, map_name, room } = data;
        socketIO.to(room).emit('get map', { map_id, map_name })
    })

    // Add a 'leave room' event if needed
    socket.on('leave room', (room) => {
        socket.leave(room);
    });

    socket.on('join room', (room) => {
        // Join the specified room
        socket.join(room);
        socket.emit('room joined', room);
    });
});


// specifying this for react files
app.get('/', function (req, res) {
    res.sendFile(path + "index.html");
});


// helping to avoid 404 error on refresh.
// Define routes that should serve the 'index.html' file
const clientRoutes = ['/', '/login', '/signup', '/mapbuilder', '/404']; // List of client-side routes
app.get(clientRoutes, (req, res) => {
    res.sendFile(path + 'index.html');
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
