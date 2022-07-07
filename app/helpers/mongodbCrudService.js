
module.exports = serviceDb = { //Declaracio global de serviceDB
    crearJugador,
    modificarNomJugador,
    llistatJugadors,
    crearPartida,
    eliminarPartides,
    llistarPartides,
    rankingSorted,
    perdedor,
    guanyador
}



async function crearJugador(nomJugador) {
    const jsultimJugador = await dbMongoDB.Jugadors.find({}).limit(1).sort({ id: -1 }) || [];
    dbMongoDB.maxIndex = (jsultimJugador.length != 0) ? (Number(jsultimJugador[0].id) + 1) : 0;
    return await dbMongoDB.Jugadors.create({ id: dbMongoDB.maxIndex, nom: nomJugador, percentatge: 0, data_registre: new Date })
}

async function modificarNomJugador(idJugador, nouNom) {
    let existeixJugador = await dbMongoDB.Jugadors.findOne({ id: idJugador });
    if (existeixJugador == null) { return ({"message":"Aquest jugador no existeix"}) };
    Object.assign(existeixJugador, nouNom);
    await existeixJugador.save();
    return existeixJugador;
}

async function llistatJugadors() {
    return await dbMongoDB.Jugadors.find({})
}

async function crearPartida(idJugador, resultat, dau1, dau2) {
    //existeix jugador?
    let existeixJugador = await dbMongoDB.Jugadors.findOne({ id: idJugador });
    if (existeixJugador == null) { throw Error("Aquest jugador no existeix") };
    let partides,
        objPartides,
        quantitatPartides,
        partidesGuanyades,
        quantitatPartidesGuanyades,
        percentatge,
        jugador;

    existeixJugador.partides.push({
        resultat: resultat,
        dau1: dau1,
        dau2: dau2,
    });
    await existeixJugador.save();
    objPartides = await dbMongoDB.Jugadors.find({ id: idJugador }).select("partides");
    partides = objPartides[0].partides;
    quantitatPartides = partides.length;
    partidesGuanyades = partides.filter(partida => partida.resultat == 0);
    quantitatPartidesGuanyades = partidesGuanyades.length;
    percentatge = Number(quantitatPartidesGuanyades / quantitatPartides).toFixed(2);
    jugador = await dbMongoDB.Jugadors.findOne({ id: idJugador });
    Object.assign(jugador, { percentatge: percentatge });
    await jugador.save();
    return existeixJugador;
}

async function eliminarPartides(idJugador) {
    let existeixJugador = await dbMongoDB.Jugadors.findOne({ id: idJugador });
    if (existeixJugador == null) { return ({"message":"Aquest jugador no existeix"}) };
    existeixJugador.partides = [];
    return existeixJugador.save();
}

async function llistarPartides(idJugador) {
    let existeixJugador = await dbMongoDB.Jugadors.findOne({ id: idJugador });
    if (existeixJugador == null) {return ({"message":"Aquest jugador no existeix"}) };
    return existeixJugador.partides;
}

async function rankingSorted() {
    return await dbMongoDB.Jugadors.find({}).sort({ percentatge: -1 }).select({ "nom": 1, "percentatge": 1 });
}

async function perdedor() {
    return await dbMongoDB.Jugadors.find({}).limit(1).sort({ percentatge: 1 }).select({ "nom": 1, "percentatge": 1 });
}

async function guanyador() {
    return await dbMongoDB.Jugadors.find({}).limit(1).sort({ percentatge: -1 }).select({ "nom": 1, "percentatge": 1 });
}
