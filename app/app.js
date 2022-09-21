//imports
const express = require('express');
const app = express();

//Middlewares globals
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Routes
let router = require('./routes/route');
app.use(router);

const port = process.env.PORT || 3000;
let server = app.listen(port, function () {
    console.log('Express server listening on port ' + port);
});