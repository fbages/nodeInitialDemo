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
    const xatsNameSpace = io.of("/xats");
    
    xatsNameSpace.on('xatprincipal', (socket) => {
        socket.on('nouJugador', (id) => {
            crudService.crearJugador(id);
            console.log("creat jugador");
        })
    })

    //Rebre missatges
    xatsNameSpace.on('connection', (socket) => {
        console.log('a user connected to xat ' + socket.id);
        socket.on('chat message', (msg) => {
            console.log('message: ' + msg);
        });
    });

}

module.exports = socketsXats;