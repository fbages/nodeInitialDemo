const express = require('express');
let router = express.Router();
const partidesController = require('../controllers/partidesController');
const validMiddleware = require('../middlewares/validator');
const authorize = require('../middlewares/authorize');

router.post('/games/:id', authorize, validMiddleware.valIdNumber, partidesController.jugarPartida);

router.delete('/games/:id', authorize, validMiddleware.valIdNumber, partidesController.eliminarPartides);

router.get('/games/:id', authorize,validMiddleware.valIdNumber, partidesController.llistatPartides);

module.exports = router;