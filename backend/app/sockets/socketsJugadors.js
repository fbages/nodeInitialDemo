const crudService = require('../helpers/crudService');

async function socketsJugadors(io){
    let jugadors = [];
    const JugadorsNameSpace = io.of("/jugadors");
    //Conexio i desconexio usuari
    JugadorsNameSpace.on('connection', (socket) => {
        console.log('a user connected to jugadors ' + socket.id);

        socket.on("prova", msg =>{
            console.log(msg);
        })
        
        socket.on('nouJugador', async (nom, jugadoridsocket, missatgeidsocket, xatidsocket, email, password) => { 
            console.log(nom, jugadoridsocket, missatgeidsocket, xatidsocket, email, password)
            crudService.crearJugador(nom, jugadoridsocket, missatgeidsocket, xatidsocket, email, password).then( ()=>{
                console.log("afegir jugador a mongodb xat principal amb socket jugador :" + socket.id);
                crudService.afegirJugadorAlXatPrincipal(socket.id);
                }
            );
        })

        socket.on('disconnect', async () => {
            console.log('user disconnected de jugadors, ' + socket.id);
            try{
                //Enviar a tots els jugadors un emit que aquest jugador s'ha desconectat, aixi el poden borrar del 3D
                let nomJugador = await crudService.buscarNomAmbSocket(socket.id,'idsocketjugador');
                console.log(nomJugador);
                socket.broadcast.volatile.emit('jugadorDesconecat', nomJugador);
            } catch {
                console.log("No s'ha pogut eliminar");
            }
        });

        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
          });
        
        socket.on('jugador', (jugador)=>{
            //console.log(jugador, 'ha arribat nova posicio al server dun jugador');
            socket.broadcast.volatile.emit("altresjugadors", jugador);
        })
    });
    
}
module.exports = socketsJugadors;