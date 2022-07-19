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
        
        socket.on('nouJugador', async (nom, jugadoridsocket, missatgeidsocket, xatidsocket) => { 
            crudService.crearJugador(nom, jugadoridsocket, missatgeidsocket, xatidsocket).then( ()=>{
                console.log("afegir jugador a mongodb xat principal amb socket jugador :" + socket.id);
                crudService.afegirJugadorAlXatPrincipal(socket.id);
                }
            );
        })

        socket.on('disconnect', async () => {
            console.log('user disconnected, ' + socket.id);
            await crudService.eliminarJugador(socket.id);
        });

        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
          });
        
        socket.on('jugador', (jugador)=>{
            console.log(jugador, 'ha arribat nova posicio altres jugadors al server');
            let trobat = jugadors.filter(jugadorllista=>{jugadorllista.nom == jugador.nom});
            if(trobat != 'null'){
                jugadors.push(jugador);
            } else {
                Object.assign(trobat,jugador);
            }
            socket.broadcast.emit("altresjugadors", jugadors);
        })
    });
    
}
module.exports = socketsJugadors;