const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const http = require('http')
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const socketsJugadors = require('./sockets/socketsJugadors');
const socketsMissatges = require('./sockets/socketsMissatges');
const socketsXats = require('./sockets/socketsXats');

//middlewares
app.use(cors());
//app.use(helmet()); //No funcionar amb Angular, s'ha de configurar
app.use(express.static('public'));

//Ruta per conseguir html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

//Rutes sockets
app.use(socketsJugadors);
app.use(socketsMissatges);
app.use(socketsXats);



//Rebre missatges
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });
});
//Divulgar missatges
// io.on('connection', (socket) => {
//     socket.on('chat message', (msg) => {
//       io.emit('chat message', msg);
//     });
// });

  io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg);
});
  });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening in port ${PORT}`)
})