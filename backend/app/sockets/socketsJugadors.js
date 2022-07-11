const crudService = require('../helpers/crudService');

function socketsJugadors(io){

    const JugadorsNameSpace = io.of("/jugadors");
    //Conexio i desconexio usuari
    JugadorsNameSpace.on('connection', (socket) => {
        console.log('a user connected to jugadors ' + socket.id);

        socket.on('nouJugador', (nom, jugadoridsocket, missatgeidsocket, xatidsocket) => {
            console.log(nom, jugadoridsocket, missatgeidsocket, xatidsocket);
            crudService.crearJugador(nom, jugadoridsocket, missatgeidsocket, xatidsocket);
        })

        socket.on('disconnect', () => {
            console.log('user disconnected');
            crudService.eliminarJugador(socket.id);
        });
    });
    
}
module.exports = socketsJugadors;