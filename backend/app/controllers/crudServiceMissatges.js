module.exports = {
    crearXat,
    buscarXat,
    llistarXats,
    eliminarXat,
    afegirJugadorAlXat,
    treureJugadorDelXat,

    guardarMissatge,
    retornaMissatges,

    buscarSocketAmbNom,
    buscarNomAmbSocket,

    buscarIdJugadorAmbSocket,
    buscarXatsAmbId,

}

async function llistarXats(nomUsuari) {
    let id = await db.Jugadors.findOne({ nom: nomUsuari }).select('_id');
    //console.log(id);
    let xats = await db.Xats.find({ jugadors: id }).select('nomxat');
    //console.log(xats);
    return xats;
}

async function retornaMissatges(nomXatEnviat) {

    let xat = await db.Xats.findOne({ nomxat: nomXatEnviat });
    //console.log(xat);
    if (xat != null) {
        let missatges = await db.Missatges.find({ idXat: xat._id });
        //console.log(missatges);
        return missatges
    } else {
        return false
    }
}


async function crearXat(nomXat, nousJugadors) {
    //console.log('Creada sala a la db')
    let xat = await db.Xats.findOne({ nomxat: nomXat });
    if (xat == null) {
        let xat = await db.Xats.create({ nomxat: nomXat, jugadors: nousJugadors })
        return xat;
    } else {
        return null;
    }
}

async function buscarXat(nomXat) {
    let xat = await db.Xats.findOne({ nomxat: nomXat });
    return xat
}

async function eliminarXat(nomXatEliminat) {
    let xat = await db.Xats.deleteOne({ nomxat: nomXatEliminat });
    return console.log("Xat eliminat");
}


async function afegirJugadorAlXat(email, nomXat) {
    //console.log('Xat seleccionat', nomXat, email);
    let xat = await db.Xats.findOne({ nomxat: nomXat });
    let jug = await db.Jugadors.findOne({ email: email });
    console.log("Afegir jugador al xat", jug);
    try {
        await xat.jugadors.push(jug._id);
        await xat.save();
        return xat;
    } catch (err) {
        console.log(err);
    }
}

async function treureJugadorDelXat(id, nomXat) {
    let xat = await db.Xats.findOne({ nomxat: nomXat });
    let indexeliminat = xat.jugadors.findIndex(element => element.toString() == id.toString());
    if (indexeliminat != -1) {
        xat.jugadors.splice(indexeliminat, 1);
        xat.save();
        return xat;
    }
}


async function guardarMissatge(socketMissatge, missatgeEnviat, nomXat) {
    let xat = await db.Xats.findOne({ nomxat: nomXat });
    let jugador = await db.Jugadors.findOne({ idsocketmissatge: socketMissatge });
    //console.log(xat);
    let missatge = await db.Missatges.create({
        text: missatgeEnviat,
        jugador: jugador.nom,
        idXat: xat._id
    })
    return missatge;
};

async function buscarSocketAmbNom(nomUsuari, nameSpaceSocket) {
    let jugador = await db.Jugadors.findOne({ nom: nomUsuari });
    return jugador[nameSpaceSocket];
}

async function buscarNomAmbSocket(socket, nameSpaceSocket) {
    //console.log({ [`${nameSpaceSocket}`]: socket });
    let jugador = await db.Jugadors.findOne({ [`${nameSpaceSocket}`]: socket });
    return jugador.nom
}

async function buscarIdJugadorAmbSocket(socket, nameSpaceSocket) {
    let id = await db.Jugadors.findOne({ [`${nameSpaceSocket}`]: socket }).select('_id');
    return id;
}

async function buscarXatsAmbId(id) {
    let xats = await db.Xats.find({ jugadors: id }).select('nomxat');
    return xats;
};
