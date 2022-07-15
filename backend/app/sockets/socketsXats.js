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
        socket.on('Peticio', async nomAltreUsuari => {
            //buscar nom a la bd per trobar el socket.id de Xats
            console.log("S'ha rebut una petició de " + socket.id + "per parlar amb " + nomAltreUsuari);
            let socketAltreUsuari = await crudService.buscarSocketAmbNom(nomAltreUsuari,"idsocketxat");
            //buscar nom del usuari que fa la peticio
            let socketUsuariPeticio = await crudService.buscarNomAmbSocket(socket.id, "idsocketxat")
            socket.to(socketAltreUsuari).emit("Aceptacio parlar", "Puc parlar amb tu?", socketUsuariPeticio);
        });

        //Confirmació d'acceptacio de l'altre usuari 
        socket.on('Si accepto', async invitador =>{
            console.log('sala privada : '+ invitador);
            let invitadorSocket = await crudService.buscarSocketAmbNom(invitador,"idsocketxat");
            socket.join(invitadorSocket);
            // const rooms = xatsNameSpace.adapter.rooms;
            // const sids = xatsNameSpace.adapter.sids;
            socket.to(invitadorSocket).emit('Acceptat', invitador);
            console.log('Server ha unit ' + socket.id +" a la sala de l'usuari " + invitador)
        });

        //Missatge privat rebut i reenviat en el xat privat
        socket.on('Missatge privat', async (anfitrioRoom, nomMissatger, msg)=>{
            console.log(`Sala: ${anfitrioRoom}  Missatger: ${nomMissatger}  Msg: ${msg}`);
            let anfitrioSocket = await crudService.buscarSocketAmbNom(anfitrioRoom,"idsocketxat");
            let missatgerSocket = await crudService.buscarSocketAmbNom(nomMissatger,"idsocketxat");
            console.log(`Missatge privat : ${msg} de ${missatgerSocket} enviat a la room ${anfitrioSocket}`);
            xatsNameSpace.to(anfitrioSocket).emit(`Missatge privat distribuit`, anfitrioRoom, nomMissatger, msg); //socket or xatsNameSpace
        });
        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
          });
    });

    xatsNameSpace.adapter.on("create-room", (room) => {
        console.log(`room ${room} was created`);
    });
    

}

module.exports = socketsXats;