
module.exports = {

    getEmail,
    getNickname,
    retornaNickname,
    signInJugador,
    registrarNom
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

async function registrarNom(jugador) {
    try {
        let jug = await db.Jugadors.create(jugador);
        let _id = await db.Jugadors.findOne(jugador)['_id'];
        //console.log(_id);
        //Introduir jugador a tots els xats oberts publics
        let xats = await db.Xats.find({ tipus: 'public' });
        //console.log(xats);
        for (let i = 0; i < xats.length; i++) {
            await xats[i].jugadors.push(_id);
            await xats[i].save();
        }
        return jug;
    } catch (err) {
        console.log(err);
    }
}

async function signInJugador(jugador) {
    //console.log('signinjugador', jugador);
    let jugadorTrobat = await db.Jugadors.findOne(jugador);
    //console.log(jugadorTrobat);
    return (jugadorTrobat == null) ? false : true;
}