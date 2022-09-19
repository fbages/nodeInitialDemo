
module.exports = {
    crearXat,
    eliminarXat,
    afegirJugadorAlXatPrincipal,
    treureJugadorAlXatPrincipal,
    crearJugador,
    eliminarJugador,
    //llistatJugadors, //Usuari que es conectar ha de tenir llistat dels jugadors anteriors
    guardarMissatge,
    buscarSocketAmbNom,
    buscarNomAmbSocket,
    getEmail,
    getNickname,
    retornaNickname,
    regristrarSockets,
    signInJugador
}

async function getEmail(emailProva){

    let mail = await db.Jugadors.findOne({email:emailProva});
    //console.log("mail trobat : " + mail);
    if(mail == null){
        return false
    }else{
        return true
    }
}

async function getNickname(nicknameProva){
    let nom = await db.Jugadors.findOne({nom:nicknameProva});
    console.log(nom);
    if(nom == null){
        return false
    }else{
        return true
    }
}

async function retornaNickname(email){
    console.log(email);
    let jugador = await db.Jugadors.findOne({email:email});
    return jugador.nom;
}

async function regristrarSockets(jugadorSockets){
    let jugadorSockets2 = await db.Jugadors.findOneAndUpdate(jugadorSockets.email,jugadorSockets);
    //console.log(jugadorSockets2);
    return (jugadorSockets2 == null)?false:true;
}

async function signInJugador(jugador){
    console.log(jugador);
    let jugadorTrobat = await db.Jugadors.findOne(jugador);
    return (jugadorTrobat == null)?false:true;
}

async function crearXat(nomXat, nousJugadors){
    let xatPrincipal = await db.Xats.findOne({nomxat : "Principal"});
    if(xatPrincipal == null){
        let llistatJugadors = [];
        llistatJugadors.push(nousJugadors);
        let xat = await db.Xats.create({
            nomxat : nomXat,
            jugadors : llistatJugadors
        })
        return xat;
    }
}

async function eliminarXat(nomXatEliminat){
    let xat = await db.Xats.deleteOne({nomXat : nomXatEliminat});
    return console.log("Xat eliminat");
}

async function afegirJugadorAlXatPrincipal(idsocketJugador){
    let xat = await db.Xats.findOne({nomxat : "Principal"});
    let jug = await db.Jugadors.findOne({idsocketjugador : idsocketJugador});
    console.log("Afegir jugador al xat", jug);
    try{
        await xat.jugadors.push(jug._id);
        await xat.save();
        return xat;
    } catch(err){
        console.log(err);
    }
}

async function treureJugadorAlXatPrincipal(socketXatsid){
    let xat = await db.Xats.findOne({nomXat : "Principal"});
    let jugador = await db.Jugadors.findOne({idsocketjugador : socketXatsid});
    xat.jugadors.splice(xat.jugadors.findIndex(jug => jug === jugador._id),1);
    xat.save();
    return xat;
}

async function crearJugador(nomJugador, idSocketJugador, idSocketMissatges, idSocketXat, email, password){
    console.log('Sha creat jugador')
    let jugador = await db.Jugadors.create({
        nom : nomJugador,
        idsocketjugador : idSocketJugador,
        idsocketmissatge : idSocketMissatges,
        idsocketxat : idSocketXat,
        email: email,
        password : password

    });
    return jugador;
}

async function eliminarJugador(socketJugador){
    try{
        //borrar de jugadors
        let jugadorEliminat = await db.Jugadors.findOne({idsocketjugador : socketJugador});
        console.log(jugadorEliminat);
        await jugadorEliminat.remove();
        //borrar jugador del llistat de jugadors al xat principal
        let xatPrincipal = await db.Xats.findOne({nomxat : "Principal"});
        console.log(xatPrincipal.jugadors);
        xatPrincipal.jugadors.splice(xatPrincipal.jugadors.findIndex(jug => jug === jugadorEliminat._id),1);
        xatPrincipal.save();
        return console.log("Jugador eliminat de tot arreu, jugadors i xat principal");
    }catch(err){
        console.log(Error("Ha arribat un usuari però no s'ha registrat"));
    }
}

async function guardarMissatge(socketMissatge,missatgeEnviat,nomXat){
    let xat = await db.Xats.findOne({nomxat: nomXat});
    let jugador = await db.Jugadors.findOne({idsocketmissatge: socketMissatge});
    
    let missatge = await db.Missatges.create({
        text : missatgeEnviat,
        jugador : jugador._id,
        idXat : xat._id
    })
    return missatge;
};

async function buscarSocketAmbNom(nomUsuari, nameSpaceSocket){
     let jugador = await db.Jugadors.findOne({nom:nomUsuari});
     return jugador[nameSpaceSocket];
}

async function buscarNomAmbSocket(socket, nameSpaceSocket){
    let jugador = await db.Jugadors.findOne({[`${nameSpaceSocket}`]:socket});
    console.log(jugador.nom);
    return jugador.nom
}