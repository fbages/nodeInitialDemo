const { validationResult } = require('express-validator');

exports.crearJugador = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let nomJugador = req.params.nom;
        let jugador = await serviceDb.crearJugador(nomJugador);
        //console.log(jugador);
        res.json(jugador);
    } catch (err) {
        console.log(err);
        next();
    }
}

exports.actualitzarNomJugador = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let idJugador = req.params.id;
        let nouNom = { "nom": req.query.nom };
        let jugador = await serviceDb.modificarNomJugador(idJugador,nouNom);
        res.json(jugador);
    } catch (err) {
        console.log(err);
        next();
    }
}

exports.llistatJugadors = async (req, res, next) => {
    try {
        res.json(await serviceDb.llistatJugadors());
    } catch (err) {
        console.log(err);
        next();
    }
}
