"use stict";

const app = require("./app");
const http = require('./app')
const { PORT, SOCKET_PORT } = require("./config");

app.listen(PORT, function () {
    console.log(`Started on http://localhost:${PORT}`);
});

http.listen(SOCKET_PORT, () => {
    console.log(`Server listening on ${SOCKET_PORT}`);
});