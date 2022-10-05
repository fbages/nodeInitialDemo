
module.exports = {
    registrarSockets,
}

async function registrarSockets(jugadorSockets) {
    //console.log(jugadorSockets);
    let jugadorSockets2 = await db.Jugadors.findOneAndUpdate({ email: jugadorSockets.email }, jugadorSockets);
    jugadorSockets2 = await db.Jugadors.findOne({ email: jugadorSockets.email }); //el torna a buscar perque sino l'anterior dona la busca vella
    //console.log('registrat nous sockets',jugadorSockets2);
    return (jugadorSockets2 == null) ? false : true;
}