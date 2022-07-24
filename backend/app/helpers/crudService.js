
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
    buscarNomAmbSocket

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