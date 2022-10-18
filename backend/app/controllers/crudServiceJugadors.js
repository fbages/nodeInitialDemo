
module.exports = {
    registrarSockets,
    crearJugador,
    buscarJugador,
    eliminarJugador,

    llistatJugadors, 
    llistatJugadorsXatPrivat,

    statusDesconectat,
}

async function registrarSockets(jugadorSockets) {
    //console.log(jugadorSockets);
    let jugadorSockets2 = await db.Jugadors.findOneAndUpdate({ email: jugadorSockets.email }, jugadorSockets);
    jugadorSockets2 = await db.Jugadors.findOne({ email: jugadorSockets.email }); //el torna a buscar perque sino l'anterior dona la busca vella
    //console.log('registrat nous sockets',jugadorSockets2);
    return (jugadorSockets2 == null) ? false : true;
}

async function crearJugador(nomJugador, idSocketJugador, idSocketMissatges, idSocketXat, email, password) {
    //console.log('Sha creat jugador')
    let jugador = await db.Jugadors.create({
        nom: nomJugador,
        idsocketjugador: idSocketJugador,
        idsocketmissatge: idSocketMissatges,
        idsocketxat: idSocketXat,
        email: email,
        password: password

    });
    return jugador;
}

async function eliminarJugador(socketJugador) {
    try {
        //borrar de jugadors
        let jugadorEliminat = await db.Jugadors.findOne({ idsocketjugador: socketJugador });
        //console.log(jugadorEliminat);
        await jugadorEliminat.remove();
        //borrar jugador del llistat de jugadors al xat principal
        let xatPrincipal = await db.Xats.findOne({ nomxat: "Principal" });
        //console.log(xatPrincipal.jugadors);
        xatPrincipal.jugadors.splice(xatPrincipal.jugadors.findIndex(jug => jug === jugadorEliminat._id), 1);
        xatPrincipal.save();
        return console.log("Jugador eliminat de tot arreu, jugadors i xat principal");
    } catch (err) {
        console.log(Error("Ha arribat un usuari però no s'ha registrat"));
    }
}

async function buscarJugador(objecte){
        let jugador = await db.Jugadors.findOne(objecte);
        //console.log(objecte,jugador);
        return jugador
}

async function llistatJugadors() {
    let jugadors = await db.Jugadors.find({}).select('_id');
    //console.log(jugadors);
    return jugadors;
}

async function llistatJugadorsXatPrivat(jugadorsXat) {
    let jugadors = await db.Jugadors.find({ $or: [{ nom: jugadorsXat[0] }, { nom: jugadorsXat[1] }] }).select('_id');
    //console.log(jugadors);
    return jugadors;
}

async function statusDesconectat(nomJugador) {
    let statusJugador = await db.Jugadors.findOneAndUpdate({ nom: nomJugador }, { status: false });
    return false
}