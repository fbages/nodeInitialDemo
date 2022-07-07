const express = require('express');
let router = express.Router();
const validMiddleware = require('../middlewares/validator');
const controllersJugador = require('../controllers/playerController');
const authorize = require('../middlewares/authorize');

router.post('/players/:nom', authorize, validMiddleware.valNom, controllersJugador.crearJugador);
router.post('/players/',authorize, validMiddleware.valNom, controllersJugador.crearJugador);

router.put('/players/:id',authorize, validMiddleware.valIdNumberQueryMin, controllersJugador.actualitzarNomJugador);

router.get('/players',authorize, controllersJugador.llistatJugadors);

module.exports = router;