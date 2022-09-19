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
            console.log('user disconnected, ' + socket.id);
            try{
                //await crudService.eliminarJugador(socket.id);
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