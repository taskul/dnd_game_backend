"use stict";


const { http } = require('./app')
const { socketIO } = require('./app')
const { PORT } = require("./config");


http.listen(PORT, () => {
    console.log(`Started on http://localhost:${PORT}`);
});

socketIO.listen(4000, () => {
    console.log(`Started on http://localhost:${4000}`);
});

