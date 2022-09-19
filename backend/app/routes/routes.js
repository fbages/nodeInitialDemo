const controllers = require('../controllers/controller');
const express = require('express');
const router = express.Router();

router.post('/email', controllers.getEmail);
router.post('/nickname', controllers.getNickname);
// router.post('/nouJugador',controllers.nouJugador);
router.post('/signin', controllers.signInJugador);

module.exports = router;