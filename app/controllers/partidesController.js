const { validationResult } = require('express-validator');

exports.jugarPartida = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let idJugador = req.params.id;
        let dau1, dau2;
        dau1 = Math.floor(Math.random() * 6 + 1);
        dau2 = Math.floor(Math.random() * 6 + 1);
        let resultat = dau1 + dau2 == 7 ? 0 : 1;
        let partida = await serviceDb.crearPartida(idJugador, resultat, dau1, dau2);
        res.json(partida);
    } catch (err) {
        next(err);
    }
};

exports.eliminarPartides = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let idJugador = req.params.id;
        let partida = await serviceDb.eliminarPartides(idJugador);
        res.json(partida);
    } catch (err) {
        console.log(err);
        next();
    }
};

exports.llistatPartides = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let idJugador = req.params.id;
        let llistat = await serviceDb.llistarPartides(idJugador);
        res.json(llistat);
    } catch (err) {
        console.log(err);
        next();
    }
};
