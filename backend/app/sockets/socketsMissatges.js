const crudService = require('../helpers/crudService');

function ioMissatges(io) {
    const missatgesNameSpace = io.of("/missatges");

    //Rebre missatges i reenviarlos a la resta d'usuaris globals
    missatgesNameSpace.on('connection', (socket) => {
        console.log('a user connected to missatges ' + socket.id);


        //unir a les rooms de xat
        setTimeout( async ()  => {
    
            socket.join('Xat General');
           // console.log(socket.id);
            let idJugador = await crudService.buscarIdJugadorAmbSocket(socket.id,"idsocketmissatge");
           // console.log(idJugador);
            let xats = await crudService.buscarXatsAmbId(idJugador);

            //console.log(xats);
            for(let i = 0; i< xats.length; i++ ){
               // console.log(i, xats[i].nomxat)
                socket.join(xats[i].nomxat);
            }
          //  console.log(socket.rooms);
        }, 1000);

        socket.on('chat message', async (msg, nomXat) => {
            //Buscar socket.id al llistat de jugadors per enviar a la resta el nom del jugador
            let nomJugador = await crudService.buscarNomAmbSocket(socket.id, "idsocketmissatge");
            
            //Salvar missatge a la db
            await crudService.guardarMissatge(socket.id, msg, nomXat);
            
            //console.log('message: ' + msg, nomXat);
            //Comprova que tots els usuaris estant a la sala on s'envia el missatge (sala creada en sessio)
            let idJugador = await crudService.buscarIdJugadorAmbSocket(socket.id,"idsocketmissatge");
           // console.log(idJugador);
            let xats = await crudService.buscarXatsAmbId(idJugador);
          //console.log(xats);
          for(let i = 0; i< xats.length; i++ ){
              // console.log(i, xats[i].nomxat)
               socket.join(xats[i].nomxat);
           }
        //    console.log('Afegits tots els jugadors')
        //    console.log(socket.rooms);
            socket.broadcast.to(nomXat).emit('chat message', msg, nomJugador,nomXat);
        });

        socket.on('nou chat', async()=>{
             // console.log(socket.id);
             let idJugador = await crudService.buscarIdJugadorAmbSocket(socket.id,"idsocketmissatge");
              //console.log(idJugador);
              let xats = await crudService.buscarXatsAmbId(idJugador);
           // console.log(xats);
            for(let i = 0; i< xats.length; i++ ){
                // console.log(i, xats[i].nomxat)
                 socket.join(xats[i].nomxat);
             }
            //  console.log('Afegits tots els jugadors')
            //  console.log(socket.rooms);
        })

        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    });
}




module.exports = ioMissatges;