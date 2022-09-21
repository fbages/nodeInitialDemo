const crud = require('../helpers/crudService');

exports.getEmail = async (req, res, next) => {
    try {
        let emailProvat = req.body.email;
        console.log(emailProvat);
        let resultat = await crud.getEmail(emailProvat)
        res.send({"data":resultat});    
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}

exports.getNickname = async (req, res, next) => {
    try {
        let nomProvat = req.body.nom;
        console.log(nomProvat);
        let resultat = await crud.getNickname(nomProvat)
        res.send({"data":resultat});
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}

exports.retornaNickname = async (req, res, next) => {
    try {
        let emailEnviat = req.body.email;
        let resultat = await crud.retornaNickname(emailEnviat)
        res.send({"data":resultat});
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}

exports.signInJugador = async (req, res, next) => {
    try {
        console.log(req.body);
        let controlUsuariPassword = {};
        controlUsuariPassword.email=req.body.email; 
        controlUsuariPassword.password=req.body.password; 
        let resultat = await crud.signInJugador(controlUsuariPassword);
        console.log(resultat);
        if(resultat){
        await crud.regristrarSockets(req.body);
        }
        res.send({"data":resultat});
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}

exports.llegirMissatges = async (req, res, next) => {
    try {
        let nomXatEnviat = req.body.nomXat;
        let resultat = await crud.retornaMissatges(nomXatEnviat);
        if(resultat==false){
            res.send({"data":[]})
        }else{
            res.send({"data":resultat});
        }
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}
exports.creacioSala = async (req, res, next) => {
    try {
        let nomXatEnviat = req.body.nomXat;
        let totsJugadors = await crud.llistatJugadors();
        let resultat = await crud.crearXat(nomXatEnviat,totsJugadors);
        if(resultat==null){
            res.send({"data":"sala ja existent"})
        }else{
            res.send({"data":resultat});
        }
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}