
const express = require('express');
require('./config/config');
const errorHandler = require('./middlewares/errorHandler');
const routerPlayers = require('./routes/routePlayers');
const routerPartides = require('./routes/routePartides');
const routerRanking = require('./routes/routeRanking');
const routerAdmin = require('./routes/routeAdmin');
const app = express();

//Middleware a totes les rutes per partir els JSON dels POST
app.use(express.urlencoded({extended: true}));
app.use(express.json());


//Routes
app.use(routerPlayers);
app.use(routerPartides);
app.use(routerRanking);
app.use(routerAdmin);

app.get('*', (req,res)=>{
    res.status(404);
    res.json({
        status:false,
        message:"Page not found"
    })
});

app.post('*', (req,res)=>{
    res.status(404);
    res.json({
        status:false,
        message:"Page not found"
    })
});

//Middleware ErrorHandler a posteriori de les routes
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server listen on port ${PORT}`);
})