const crudService = require('../helpers/crudService');

class XatClass {
    constructor(nomXat,jugadors){
        this.nomXat = nomXat;
        this.jugadors = jugadors;
    }
    get nom(){
        return this.nomXat;
    }

    get jugadors(){
        return this.jugadors;
    }
}


function socketsXats(io) {
    const XatsNameSpace = io.of("/Xats");
    XatsNameSpace.on('xatprincipal', (socket) => {
        socket.on('nouJugador', (id) => {
            crudService.crearJugador(id);
            console.log("creat jugador");
        })
    })

    //Rebre missatges
    XatsNameSpace.on('connection', (socket) => {
        console.log('a user connected2a ' + socket.id);
        socket.on('chat message', (msg) => {
            console.log('message: ' + msg);
        });
    });
    //Divulgar missatges
    // XatsNameSpace.on('connection', (socket) => {
    //     socket.on('chat message', (msg) => {
    //       io.emit('chat message', msg);
    //     });
    // });

    XatsNameSpace.on('connection', (socket) => {
        console.log('a user connected2b ' + socket.id);
        socket.on('chat message', (msg) => {
            socket.broadcast.emit('chat message', msg);
        });
    });
}

module.exports = socketsXats;