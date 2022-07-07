const sequelize = require('sequelize');

module.exports = serviceDb = { //Declaracio global de serviceDB
    crearJugador,
    modificarNomJugador,
    llistatJugadors,
    crearPartida,
    eliminarPartides,
    llistaPartides,
    rankingSorted,
    perdedor,
    guanyador
}

async function crearJugador(nomJugador) {
    return await dbMysql.Jugadors.create({ nom: nomJugador, percentatge: 0, data_registre: new Date })
}

async function modificarNomJugador(idJugador, nouNom) {
    let existeixJugador = await dbMysql.Jugadors.findOne({ where: { id: idJugador }});
    if (existeixJugador == null) { return ({"message":"Aquest jugador no existeix"}) };
    Object.assign(existeixJugador, nouNom);
    await existeixJugador.save();
    return existeixJugador;
}

async function llistatJugadors() {
    return await dbMysql.Jugadors.findAll({})
}

async function crearPartida(idJugador, resultat, dau1, dau2) {
    let existeixJugador = await dbMysql.Jugadors.findOne({ where: { id: idJugador }});
    if (existeixJugador == null) { return ({"message":"Aquest jugador no existeix"}) };
    let partides,
        quantitatPartides,
        partidesGuanyades,
        quantitatPartidesGuanyades,
        percentatge,
        jugador;

    let partida = await dbMysql.Partides.create({
        idjugador: idJugador,
        resultat: resultat,
        dau1: dau1,
        dau2: dau2,
    });
    partides = await dbMysql.Partides.findAll({
        where: { idjugador: idJugador },
    });
    quantitatPartides = partides.length;
    partidesGuanyades = await dbMysql.Partides.findAll({
        where: { idjugador: idJugador, resultat: 0 },
    });
    quantitatPartidesGuanyades = partidesGuanyades.length;
    percentatge = Number(
        quantitatPartidesGuanyades / quantitatPartides
    ).toFixed(2);
    jugador = await dbMysql.Jugadors.findOne({ where: { id: idJugador } });
    Object.assign(jugador, { percentatge: percentatge });
    await jugador.save();
    return partida;
}

async function eliminarPartides(idJugador) {
    let existeixJugador = await dbMysql.Jugadors.findOne({ where: { id: idJugador }});
    if (existeixJugador == null) { return ({"message":"Aquest jugador no existeix"}) };
    await dbMysql.Partides.destroy({ where: { idjugador: idJugador } });
    return {'message':`El.liminades totes les partides del jugador ${idJugador}`};
}

async function llistaPartides(idJugador) {
    let existeixJugador = await dbMysql.Jugadors.findOne({ where: { id: idJugador }});
    if (existeixJugador == null) { return ({"message":"Aquest jugador no existeix"}) };
    return await dbMysql.Partides.findAll({ where: { idjugador: idJugador }, });
}

async function rankingSorted() {
    return await dbMysql.Jugadors.findAll({
        attributes: ['nom', 'percentatge'],
        order: [["percentatge", "DESC"]]
    });

}

async function perdedor() {
    return await dbMysql.Jugadors.findAll({
        attributes: ['nom', 'percentatge'],
        order: [["percentatge", "ASC"]],
        limit: [1]
    });

}

async function guanyador() {
    return await dbMysql.Jugadors.findAll({
        attributes: ['nom', 'percentatge'],
        order: [["percentatge", "DESC"]],
        limit: [1]
    });
}
