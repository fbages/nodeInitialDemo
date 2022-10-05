const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const http = require('http');
const server = http.createServer(app);
const routes = require('./routes/routes');
const { Server } = require("socket.io");
const io = new Server(server,{
    cors: {
        origins: ['http://localhost:4200','ws://localhost:4200']}});

//Arrancar la base de dades mongodb
require('./config/config');

//middlewares
app.use(express.json());
app.use(cors());
app.use(helmet()); //No funcionar amb Angular, s'ha de configurar o modificar els scripts per separat

//Rutes http
app.use(routes);

//Rutes sockets
//require('./sockets/socketsXats')(io);
require('./sockets/socketsJugadors')(io);
require('./sockets/socketsMissatges')(io);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening in port ${PORT}`)
})