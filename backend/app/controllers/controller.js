const crud = require('./crudServiceMissatges');
const crudServiceJugadors = require('./crudServiceJugadors');
const crudController = require('./crudController');

exports.status = async (req, res, next) => {
    try {
        let emailProvat = req.body.email;
        let jugador = await crudServiceJugadors.buscarJugador({email:emailProvat})
        res.send({ "data": jugador.status });
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}

exports.statusDesconectat = async (req, res, next) => {
    //console.log(req.body,1);

    try {
        let emailProvat = req.body.email;
        let jugador = await crudServiceJugadors.buscarJugador({email:emailProvat});
        let resultat = await crudServiceJugadors.statusDesconectat(jugador.nom);
        res.send({ "data": resultat.status });
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}

exports.getEmail = async (req, res, next) => {
    try {
        let emailProvat = req.body.email;
        //console.log(emailProvat);
        let resultat = await crudController.getEmail(emailProvat)
        res.send({ "data": resultat });
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}

exports.getNickname = async (req, res, next) => {
    try {
        let nomProvat = req.body.nom;
        //console.log(nomProvat);
        let resultat = await crudController.getNickname(nomProvat)
        res.send({ "data": resultat });
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}

exports.retornaNickname = async (req, res, next) => {
    try {
        let emailEnviat = req.body.email;
        let resultat = await crudController.retornaNickname(emailEnviat)
        res.send({ "data": resultat });
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}

exports.registrarNom = async (req, res, next) => {
    try {
        //console.log(req.body);
        let usuari = {};
        usuari.email = req.body.email;
        usuari.password = req.body.password;
        usuari.nom = req.body.nom;
        usuari.status = req.body.status
        let resultat = await crudController.registrarNom(usuari);
        let _id = await crud.afegirJugadorAlXat(usuari.email, "Xat General");
        res.send({ "data": resultat });
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}

exports.signInJugador = async (req, res, next) => {
    try {
        //console.log(req.body);
        let controlUsuariPassword = {};
        controlUsuariPassword.email = req.body.email;
        controlUsuariPassword.password = req.body.password;
        let resultat = await crudController.signInJugador(controlUsuariPassword);
        //console.log(resultat);
        if (resultat) {
            await crudServiceJugadors.registrarSockets(req.body);
        }
        res.send({ "data": resultat });
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}

exports.llegirMissatges = async (req, res, next) => {
    try {
        let nomXatEnviat = req.body.nomXat;
        let resultat = await crud.retornaMissatges(nomXatEnviat);
        if (resultat == false) {
            res.send({ "data": [] })
        } else {
            res.send({ "data": resultat });
        }
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}
// exports.llegirsales = async (req, res, next) => {
//     try {
//         let nomUsuari = req.body.nom;
//         //console.log(nomUsuari)
//         let resultat = await crud.llistarXats(nomUsuari);
//         if (resultat == false) {
//             res.send({ "data": [] })
//         } else {
//             res.send({ "data": resultat });
//         }
//     } catch (err) {
//         res.status(400);
//         res.json(err);
//     }
// }

// exports.creacioSala = async (req, res, next) => {
//     try {
//         let nomXatEnviat = req.body.nomXat;
//         let totsJugadors = await crud.llistatJugadors();
//         let resultat = await crud.crearXat(nomXatEnviat, totsJugadors);
//         if (resultat == null) {
//             res.send({ "data": "sala ja existent" })
//         } else {
//             res.send({ "data": resultat });
//         }
//     } catch (err) {
//         res.status(400);
//         res.json(err);
//     }
// }