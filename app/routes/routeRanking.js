const express = require('express');
let router = express.Router();
const rankingController = require('../controllers/rankingController');
const authorize = require('../middlewares/authorize');

router.get('/ranking',authorize, rankingController.llistatGuanyadors);

router.get('/ranking/loser',authorize, rankingController.perdedor);

router.get('/ranking/winner',authorize, rankingController.guanyador);

module.exports = router;