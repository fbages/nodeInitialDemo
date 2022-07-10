
module.exports = {
    crearXat,
    crearJugador,
    //llistatJugadors, //Usuari que es conectar ha de tenir llistat dels jugadors anteriors
    guardarMissatge,

}

async function crearXat(nomXat, jugadors){
    let llistatJugadors = jugadors;
    let xat = await db.Xats.create({
        nomXat : nomXat,
        jugadors : llistatJugadors
    })
    return xat;
}

async function crearJugador(nomJugador, idSocket, idSocketMissatges){
    let jugador = await db.Jugadors.create({
        nom : nomJugador,
        idsocket : idSocket,
        idsocketmissatges : idSocketMissatges
    });
    return jugador;
}


async function guardarMissatge(nomJugador,missatgeEnviat,nomXat){
    let xat = await db.Xats.findOne({nomXat: nomXat});
    let jugador = await db.Jugadors.findOne({nom: nomJugador});
    let missatge = await db.Missatge.create({
        text : missatgeEnviat,
        jugador : jugador._id,
        idXat : xat._id
    })
    return missatge;
};
