const crudService = require('../helpers/crudService');
const mongoose = require('mongoose');

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
    xatsNameSpace.once('connection', (socket) => {
        console.log('Creat xat principal');
        crudService.crearXat('Principal') //sense jugadors, queda un null al primer
    });

    xatsNameSpace.on('connection', (socket) => {
        console.log('a user connected to xat principal' + socket.id); 
        crudService.afegirJugadorAlXatPrincipal("Ana");

        socket.on('chat message', (msg) => {
            console.log('message: ' + msg);
        });
        
        socket.on('disconnect', (socket)=>{
            console.log('a user connected to xat principal' + socket.id); 
            crudService.treureJugadorAlXatPrincipal("Ana");
        } )
    });

}

module.exports = socketsXats;