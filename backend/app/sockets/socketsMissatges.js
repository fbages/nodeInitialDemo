const crudService = require('../helpers/crudService');

function ioMissatges(io) {
    const missatgesNameSpace = io.of("/missatges");

    //Rebre missatges i reenviarlos a la resta d'usuaris globals
    missatgesNameSpace.on('connection', (socket) => {
        console.log('a user connected to missatges ' + socket.id);
        socket.on('chat message', async (msg) => {
            await crudService.guardarMissatge(socket.id, msg, "Principal");
            console.log('message: ' + msg);
            socket.broadcast.emit('chat message', msg,"francesc");
        });

        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
          });
    });
}

module.exports = ioMissatges;