const crudService = require('../helpers/crudService');

function socketsJugadors(io){

    const JugadorsNameSpace = io.of("/jugadors");
    //Conexio i desconexio usuari
    JugadorsNameSpace.on('connection', (socket) => {
        console.log('a user connected to jugadors ' + socket.id);

        socket.on('nouJugador', (nom, missatgeidsocket) => {
            console.log(nom, missatgeidsocket);
            crudService.crearJugador(nom, socket.id, missatgeidsocket);
        })

        socket.on('disconnect', () => {
            console.log('user disconnected');
            socket.emit('foraJugador', socket.id);
        });
    });
    
}
module.exports = socketsJugadors;