const express = require('express');
let router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middlewares/authenticate');

router.post('/login',authenticate, adminController.retornJWT);


module.exports = router;