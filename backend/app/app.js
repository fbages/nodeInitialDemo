const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const http = require('http')
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

require('./sockets/socketsXats')(io);
require('./sockets/socketsJugadors')(io);
require('./sockets/socketsMissatges')(io);

//middlewares
app.use(cors());
//app.use(helmet()); //No funcionar amb Angular, s'ha de configurar
app.use(express.static('public'));


//Ruta per conseguir html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index2.html');
    // res.sendFile(__dirname + '/public/index.html');
});

//Rutes sockets
socketsJugadors(server);
//socketsXats(server);
//socketsMissatges(server);



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening in port ${PORT}`)
})