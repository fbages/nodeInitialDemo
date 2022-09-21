//imports
let express = require('express');
let router = express.Router();
let usuariHoraController = require('../controllers/usuariHoraController');
let pokemonController = require('../controllers/pokemonController');
let pujarImatge = require('../controllers/pujarImatge');
const customMiddlewares = require('../middlewares/middleware');

//Middlewares a routes especifiques
let cors = require('cors');

//routes
router.get('/user', (req, res) => {
    res.send({ "nom": 'Francesc Bages Sabarich', "edat": 38, "uri": "localhost:3000/user" });
});

router.post('/upload',   pujarImatge.pujar);

router.post('/time', cors(), customMiddlewares.cacheHeader, customMiddlewares.authHeader, usuariHoraController.usuariHora);

router.get('/pokemon/:id', pokemonController.pokemon);

router.all('*', (req, res) => {
    res.status(404);
    res.send({ message: 'Page not found' })
}
);



module.exports = router;