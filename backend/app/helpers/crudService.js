
module.exports = {
    crearXat,
    eliminarXat,
    afegirJugadorAlXatPrincipal,
    treureJugadorAlXatPrincipal,
    crearJugador,
    eliminarJugador,
    llistatJugadors, //Usuari que es conectar ha de tenir llistat dels jugadors anteriors
    llistatJugadorsXatPrivat,
    guardarMissatge,
    buscarSocketAmbNom,
    buscarNomAmbSocket,
    getEmail,
    getNickname,
    retornaNickname,
    registrarSockets,
    signInJugador,
    retornaMissatges,
    retornaXat,
    buscarIdJugadorAmbSocket,
    buscarXatsAmbId,
    llistarXats
}

async function llistarXats(nomUsuari){
    let id = await db.Jugadors.findOne({nom : nomUsuari}).select('_id');
    //console.log(id);
    let xats = await db.Xats.find({jugadors:id}).select('nomxat');
    //console.log(xats);
    return xats;
}

async function getEmail(emailProva) {

    let mail = await db.Jugadors.findOne({ email: emailProva });
    //console.log("mail trobat : " + mail);
    if (mail == null) {
        return false
    } else {
        return true
    }
}

async function getNickname(nicknameProva) {
    let nom = await db.Jugadors.findOne({ nom: nicknameProva });
    //console.log(nom);
    if (nom == null) {
        return false
    } else {
        return true
    }
}

async function retornaNickname(email) {
    //console.log(email);
    let jugador = await db.Jugadors.findOne({ email: email });
    //console.log("jugador trobat: ",jugador);
    return jugador.nom;
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

async function registrarSockets(jugadorSockets) {
    //console.log(jugadorSockets);
    let jugadorSockets2 = await db.Jugadors.findOneAndUpdate({ email: jugadorSockets.email }, jugadorSockets);
    jugadorSockets2 = await db.Jugadors.findOne({ email: jugadorSockets.email });
    //console.log('registrat nous sockets',jugadorSockets2);
    return (jugadorSockets2 == null) ? false : true;
}

async function signInJugador(jugador) {
    //console.log('signinjugador', jugador);
    let jugadorTrobat = await db.Jugadors.findOne(jugador);
    //console.log(jugadorTrobat);
    return (jugadorTrobat == null) ? false : true;
}

async function crearXat(nomXat, nousJugadors) {
    let xat = await db.Xats.findOne({ nomxat: nomXat });
    if (xat == null) {
        let xat = await db.Xats.create({ nomxat: nomXat, jugadors: nousJugadors })
        return xat;
    } else {
        return null;
    }
}

async function eliminarXat(nomXatEliminat) {
    let xat = await db.Xats.deleteOne({ nomxat: nomXatEliminat });
    return console.log("Xat eliminat");
}

async function retornaXat(nomXat) {
    let xat = await db.Xats.findOne({ nomxat: nomXat });
    return xat
}

async function afegirJugadorAlXatPrincipal(idsocketJugador) {
    let xat = await db.Xats.findOne({ nomxat: "Xat General" });
    let jug = await db.Jugadors.findOne({ idsocketjugador: idsocketJugador });
    //console.log("Afegir jugador al xat", jug);
    try {
        await xat.jugadors.push(jug._id);
        await xat.save();
        return xat;
    } catch (err) {
        console.log(err);
    }
}

async function treureJugadorAlXatPrincipal(socketXatsid) {
    let xat = await db.Xats.findOne({ nomXat: "Xat General" });
    let jugador = await db.Jugadors.findOne({ idsocketjugador: socketXatsid });
    xat.jugadors.splice(xat.jugadors.findIndex(jug => jug === jugador._id), 1);
    xat.save();
    return xat;
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
    //console.log(socket,nameSpaceSocket);
    //console.log({[`${nameSpaceSocket}`]:socket});
    let jugador = await db.Jugadors.findOne({ [`${nameSpaceSocket}`]: socket });
    //console.log(jugador);
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
