
function socketsJugadors(io){

    const JugadorsNameSpace = io.of("/Jugadors");
    //Conexio i desconexio usuari
    JugadorsNameSpace.on('connection', (socket) => {
        console.log('a user connected ' + socket.id);
        socket.emit('nouJugador', socket.id);
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
    
}
module.exports = socketsJugadors;