const crudService = require('../helpers/crudService');
const crudServiceJugadors = require('../helpers/crudServiceJugadors');

async function socketsJugadors(io) {
    
    const JugadorsNameSpace = io.of("/jugadors");
    //Conexio i desconexio usuari
    JugadorsNameSpace.on('connection', async (socket) => {
        console.log('a user connected to jugadors ' + socket.id);

        // nomes index.js
        // socket.on('nouJugador', async (nom, jugadoridsocket, missatgeidsocket, email, password) => {
        //     //console.log(nom, jugadoridsocket, missatgeidsocket, xatidsocket, email, password)
        //     crudService.crearJugador(nom, jugadoridsocket, missatgeidsocket, email, password).then(() => {
        //         //console.log("afegir jugador a mongodb xat principal amb socket jugador :" + socket.id);
        //     crudService.afegirJugadorAlXatPrincipal(socket.id);
        //     }
        //     );
        // })

        socket.on('socketsInJugador', async (nom, jugadoridsocket, missatgeidsocket,email,password) => {
            let jugador = {
                nom: nom,
                idsocketjugador : jugadoridsocket,
                idsocketmissatge : missatgeidsocket,
                //idsocketxat : xatidsocket,
                email: email,
                password:password,
                status: true
            };

            await crudServiceJugadors.registrarSockets(jugador);
        })

        socket.on('disconnect', async () => {
            console.log('user disconnected de jugadors, ' + socket.id);
            try {
                //Enviar a tots els jugadors un emit que aquest jugador s'ha desconectat, aixi el poden borrar del 3D
                let nomJugador = await crudService.buscarNomAmbSocket(socket.id, 'idsocketjugador');
                //console.log(nomJugador);
                socket.broadcast.volatile.emit('jugadorDesconecat', nomJugador);

                //canviem a false l'status del jugador, aixi no es pot conectar un altre vegada
                let jugadorDesconectat = await crudService.statusDesconectat(nomJugador);

            } catch {
                console.log("No s'ha pogut eliminar");
            }
        });

        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });

        socket.on('jugador', (jugador) => {
            //console.log(jugador, 'ha arribat nova posicio al server dun jugador');
            socket.broadcast.volatile.emit("altresjugadors", jugador);
        })
    });

}
module.exports = socketsJugadors;