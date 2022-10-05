const controllers = require('../controllers/controller');
const express = require('express');
const router = express.Router();

router.post('/registrarNom', controllers.registrarNom);
router.post('/signIn', controllers.signInJugador);
router.post('/email', controllers.getEmail);
router.post('/status', controllers.status);
router.post('/statusstatusdesconectat', controllers.statusDesconectat);
router.post('/nickname', controllers.getNickname);
router.post('/getnickname',controllers.retornaNickname);
router.post('/missatges', controllers.llegirMissatges);
router.post('/llegirsales', controllers.llegirsales);
router.post('/creaciosala', controllers.creacioSala);

router.all('*',(req,res)=>{
    res.status(404).send({message:'Page not found'})
})

module.exports = router;