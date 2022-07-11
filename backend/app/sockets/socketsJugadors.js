const crudService = require('../helpers/crudService');

async function socketsJugadors(io){

    const JugadorsNameSpace = io.of("/jugadors");
    //Conexio i desconexio usuari
    JugadorsNameSpace.on('connection', (socket) => {
        console.log('a user connected to jugadors ' + socket.id);

        socket.on('nouJugador', (nom, jugadoridsocket, missatgeidsocket, xatidsocket) => {
            
            crudService.crearJugador(nom, jugadoridsocket, missatgeidsocket, xatidsocket).then( ()=>{
                console.log("afegir jugador a mongodb xat principal amb socket jugador :" + socket.id);
                crudService.afegirJugadorAlXatPrincipal(socket.id);
                }
            );
        })

        socket.on('disconnect', () => {
            console.log('user disconnected, ' + socket.id);
            crudService.eliminarJugador(socket.id);
        });
    });
    
}
module.exports = socketsJugadors;