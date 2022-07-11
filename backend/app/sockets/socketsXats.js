const crudService = require('../helpers/crudService');
const mongoose = require('mongoose');

class XatClass {
    constructor(nomXat, jugadors) {
        this.nomXat = nomXat;
        this.jugadors = jugadors;
    }
    get nom() {
        return this.nomXat;
    }

    get jugadors() {
        return this.jugadors;
    }
}


function socketsXats(io) {
    const xatsNameSpace = io.of("/xats");


    // xatsNameSpace.on('xatprincipal', (socket) => {
    //     socket.on('nouJugador', (id) => {
    //         crudService.crearJugador(id);
    //         console.log("creat jugador");
    //     })
    // })

    xatsNameSpace.on('connection', (socket) => {
        console.log('a user connected to xat principal : ' + socket.id);

        socket.on('disconnect', (socket) => {
            console.log('a user disconected from xat principal :' + socket.id); //surt undefined 
        });
        //Cada usuari té la seva room automaticament, quan algu vulgui parlar amb ell s'afegirà a la room del inicial
        //socket.join(socket.id);
        
        //Peticio per conectar amb un altre usuari a parlar en el meu room
        socket.on('Peticio', altreusuari => {
            console.log("S'ha rebut una petició de " + socket.id + "per parlar amb " + altreusuari);
            socket.to(altreusuari).emit("Aceptacio parlar", "Puc parlar amb tu?", socket.id);
        });

        //Confirmació d'acceptacio de l'altre usuari 
        socket.on('Si accepto', altreusuarisocket =>{
            console.log('sala privada : '+ altreusuarisocket);
            socket.join(altreusuarisocket);
            // const rooms = xatsNameSpace.adapter.rooms;
            // const sids = xatsNameSpace.adapter.sids;
            socket.to(altreusuarisocket).emit('Acceptat');
            console.log('Server ha unit ' + socket.id +' la sala del usuari ' + altreusuarisocket)
        });

        //Missatge privat rebut i reenviat en el xat privat
        socket.on('Missatge privat', (socketroom, msg)=>{
            console.log(`Missatge privat : ${msg} de ${socket.id} enviat a la room ${socketroom}`);
            xatsNameSpace.to(socketroom).emit(`Missatge privat reenviat`, socket.id, msg); //socket or xatsNameSpace
        });
    });

    xatsNameSpace.adapter.on("create-room", (room) => {
        console.log(`room ${room} was created`);
    });
    

}

module.exports = socketsXats;