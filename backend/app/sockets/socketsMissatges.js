const crudService = require('../helpers/crudService');

function ioMissatges(io) {
    const missatgesNameSpace = io.of("/missatges");

    //Rebre missatges i reenviarlos a la resta d'usuaris globals
    missatgesNameSpace.on('connection', (socket) => {
        console.log('a user connected to missatges ' + socket.id);
        socket.on('chat message', async (msg,nomXat) => {
            //Buscar socket.id al llistat de jugadors per enviar a la resta el nom del jugador
            let nomJugador = await crudService.buscarNomAmbSocket(socket.id,"idsocketmissatge");
            console.log(msg,nomXat)
            //Salvar missatge a la db
            await crudService.guardarMissatge(socket.id, msg, nomXat);
            
            //console.log('message: ' + msg, nomJugador);
            
            socket.broadcast.emit('chat message', msg, nomJugador);
        });

        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
          });
    });
}

module.exports = ioMissatges;