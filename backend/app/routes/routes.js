const controllers = require('../controllers/controller');
const express = require('express');
const router = express.Router();

router.post('/email', controllers.getEmail);
router.post('/nickname', controllers.getNickname);
router.post('/getnickname',controllers.retornaNickname);
router.post('/signin', controllers.signInJugador);
router.post('/missatges', controllers.llegirMissatges);
router.post('/creaciosala', controllers.creacioSala);

router.all('*',(req,res)=>{
    res.status(404).send({message:'Page not found'})
})

module.exports = router;