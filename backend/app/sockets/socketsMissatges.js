const crudService = require('../controllers/crudServiceMissatges');
const crudServiceJugadors = require('../controllers/crudServiceJugadors');

function ioMissatges(io) {
    const missatgesNameSpace = io.of("/missatges");

    //Rebre missatges i reenviarlos a la resta d'usuaris globals
    missatgesNameSpace.on('connection', (socket) => {

        //Missatges
        //console.log('a user connected to missatges ' + socket.id);

        //unir a les rooms de xat
        // setTimeout(async () => {

        //     socket.join('Xat General');
        //     // console.log(socket.id);
        //     let jugador = await crudServiceJugadors.buscarJugador( {"idsocketmissatge":socket.id});
        //     //console.log(jugador);
        //     let xats = await crudService.buscarXatsAmbId(jugador.id);

        //     //console.log(xats);
        //     for (let i = 0; i < xats.length; i++) {
        //         // console.log(i, xats[i].nomxat)
        //         socket.join(xats[i].nomxat);
        //     }
        //     //  console.log(socket.rooms);
        // }, 500);

        socket.on('llistatXats', async () => {

            let jugador = await crudServiceJugadors.buscarJugador({"idsocketmissatge":socket.id});
            //console.log(jugador);
            let resultat = await crudService.llistarXats(jugador.nom);
            //console.log(resultat);
            socket.emit('respostallistatXats', resultat);

        });

        socket.on('Eliminar jugador de xat', async (nomXat)=>{
            let jugador = await crudServiceJugadors.buscarJugador({"idsocketmissatge":socket.id});
            
            //let idUsuari = await crudService.buscarIdJugadorAmbSocket(socket.id, "idsocketmissatge");
            let jugadors = await crudService.treureJugadorDelXat(jugador.id,nomXat);
            // let jugadors = await crudService.treureJugadorDelXat(idUsuari._id,nomXat);
            //console.log(jugadors)
        });


        socket.on('chat message', async (msg, nomXat) => {
            //Buscar socket.id al llistat de jugadors per enviar a la resta el nom del jugador
            let nomJugador = await crudService.buscarNomAmbSocket(socket.id, "idsocketmissatge");

            //Salvar missatge a la db
            await crudService.guardarMissatge(socket.id, msg, nomXat);

            //console.log('message: ' + msg, nomXat);

            //    console.log(socket.rooms);
            socket.broadcast.to(nomXat).emit('chat message', msg, nomJugador, nomXat);
        });

        // socket.on('nou chat', async(nomXat)=>{

        //      // console.log(socket.id);
        //      let idJugador = await crudService.buscarIdJugadorAmbSocket(socket.id,"idsocketmissatge");
        //       //console.log(idJugador);
        //       let xats = await crudService.buscarXatsAmbId(idJugador);
        //     //console.log(xats);
        //     for(let i = 0; i< xats.length; i++ ){
        //         // console.log(i, xats[i].nomxat)
        //          socket.join(xats[i].nomxat);
        //      }

        //       console.log(socket.rooms);
        // });


        //Sales

        //Reenvia la creacio d'una sala publica a la resta d'usuaris
        socket.on('xat public', async (nomXat) => {
            let xat = await crudService.buscarXat(nomXat);
            //console.log(xat);
            if(xat == null){   
                //Crea un xat totalment nou
                let jugadors = await crudServiceJugadors.llistatJugadors();
                //console.log(jugadors);
                await crudService.crearXat(nomXat, jugadors);
                socket.join(nomXat);
                //si afegeix tothom, si un es borrar es nomes ell  
                socket.broadcast.emit('creat xat public', nomXat);
            } else {
                //Reenganxa un usuari que havia eliminat el xat public
                let jugador = await crudServiceJugadors.buscarJugador({'idsocketmissatge': socket.id});
                await crudService.afegirJugadorAlXat(jugador.email,nomXat);
            }
        })

        //Usuari s'uneix a la sala
        socket.on('room', async (room) => {
            //console.log(socket.id, room);
            socket.join(room);
        });
        //Usuari deixar la sala
        socket.on('deixa room', (room) => {
            socket.leave(room)
        })

        //Cada usuari té la seva room automaticament, quan algu vulgui parlar amb ell s'afegirà a la room del inicial
        //socket.join(socket.id);

        //Peticio per conectar amb un altre usuari a parlar en el meu room
        socket.on('Peticio', async (nomJugadorDemanat, nomJugadorPeticio) => {
            //buscar nom a la bd per trobar el socket.id de Xats
            //console.log("S'ha rebut una petició de " + socket.id + "per parlar amb " + nomJugadorDemanat);
            let socketAltreUsuari = await crudService.buscarSocketAmbNom(nomJugadorDemanat, "idsocketxat");
            //buscar nom del usuari que fa la peticio
            //let socketUsuariPeticio = await crudService.buscarNomAmbSocket(socket.id, "idsocketxat")
            socket.to(socketAltreUsuari).emit("Aceptacio parlar", "Puc parlar amb tu?", nomJugadorPeticio);
        });

        //Confirmació d'acceptacio de l'altre usuari 
        socket.on('Si accepto', async (nomJugadorDemanat, nomJugadorPeticio) => {
            let socketPeticio = await crudService.buscarSocketAmbNom(nomJugadorPeticio, "idsocketxat");
            //console.log('sala privada : '+ nomJugadorDemanat + ' amb socket ' + socket.id);
            //console.log('afegint socket ' + socketPeticio);
            socket.to(socketPeticio).emit('Acceptat', nomJugadorDemanat, nomJugadorPeticio);
            // console.log('Server ha unit ' + nomJugadorPeticio +" a la sala de l'usuari " + nomJugadorDemanat)
        });

        //Missatge privat rebut i reenviat en el xat privat
        socket.on('Missatge privat', async (anfitrioRoom, nomMissatger, msg) => {
            //console.log(`Sala: ${anfitrioRoom}  Missatger: ${nomMissatger}  Msg: ${msg}`);
            let anfitrioSocket = await crudService.buscarSocketAmbNom(anfitrioRoom, "idsocketxat");
            let missatgerSocket = await crudService.buscarSocketAmbNom(nomMissatger, "idsocketxat");
            //console.log(`Missatge privat : ${msg} de ${missatgerSocket} enviat a la room ${anfitrioSocket}`);
            xatsNameSpace.to(anfitrioSocket).emit(`Missatge privat distribuit`, anfitrioRoom, nomMissatger, msg); //socket or xatsNameSpace
        });

        socket.on('registrar xat privat', async (nomXat) => {
            let nomJugadors = nomXat.split('*');
            //console.log(nomJugadors);
            nomJugadors = await crudService.llistatJugadorsXatPrivat(nomJugadors)
            await crudService.crearXat(nomXat, nomJugadors)
        });

        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    });
}




module.exports = ioMissatges;