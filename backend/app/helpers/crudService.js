
module.exports = {
    crearXat,
    eliminarXat,
    afegirJugadorAlXatPrincipal,
    treureJugadorAlXatPrincipal,
    crearJugador,
    eliminarJugador,
    //llistatJugadors, //Usuari que es conectar ha de tenir llistat dels jugadors anteriors
    guardarMissatge,

}

async function crearXat(nomXat, nousJugadors){
    let llistatJugadors = [];
    llistatJugadors.push(nousJugadors);
    let xat = await db.Xats.create({
        nomxat : nomXat,
        jugadors : llistatJugadors
    })
    return xat;
}

async function eliminarXat(nomXatEliminat){
    let xat = await db.Xats.delete({nomXat : nomXatEliminat});
    return console.log("Xat eliminat");
}

async function afegirJugadorAlXatPrincipal(nomJugador){
    let xat = await db.Xats.findOne({nomxat : "Principal"});
    let jug = await db.Jugadors.findOne({nom : nomJugador});
    console.log(jug);
     xat.jugadors.push(jug._id);
     xat.save();
    return xat;
}

async function treureJugadorAlXatPrincipal(jugador){
    let xat = await db.Xats.findOne({nomXat : "Principal"});
    xat.jugadors.splice(xat.jugadors.findIndex(jug => jug === jugador),1);
    xat.save();
    return xat;
}

async function crearJugador(nomJugador, idSocketJugador, idSocketMissatges, idSocketXat){

    let jugador = await db.Jugadors.create({
        nom : nomJugador,
        idsocketjugador : idSocketJugador,
        idsocketmissatge : idSocketMissatges,
        idsocketxat : idSocketXat

    });
    return jugador;
}

async function eliminarJugador(socketJugador){
    let jugadorEliminat = await db.Jugadors.delete({idsocket : socketJugador});
    //borrar jugador del llistat de jugadors al xat principal
    let xatPrincipal = await db.Xats.findOne({nomxat : "principal"});
    let jug = xatPrincipal.jugadors.find(buscat => buscat === jugador);
    return console.log("Jugador eliminat");
}

async function guardarMissatge(nomJugador,missatgeEnviat,nomXat){
    let xat = await db.Xats.findOne({nomxat: nomXat});
    let jugador = await db.Jugadors.findOne({nom: nomJugador});
    console.log(xat,jugador);
    let missatge = await db.Missatges.create({
        text : missatgeEnviat,
        jugador : jugador._id,
        idXat : xat._id
    })
    return missatge;
};
